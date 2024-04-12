import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { FiltersEnums } from '@app/dashboard/types';
import { ManageCustomColumnDialogComponent } from '@components/manage-custom-dialog.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableColumn } from '../column.type';
import { CustomColumn, IndexListOptions, RawColumnKey, RawCustomColumnKey } from '../data';
import { RawFilters } from '../filters';
import { Page } from '../pages';
import { FiltersServiceInterface } from '../services/filtersService';
import { IndexServiceCustomInterface, IndexServiceInterface } from '../services/indexService';
import { TableType } from '../table';

export abstract class TableHandler<K extends RawColumnKey, O extends IndexListOptions, F extends RawFilters, E extends FiltersEnums> {
  readonly shareUrlService = inject(ShareUrlService);
  readonly iconsService = inject(IconsService);
  readonly autoRefreshService = inject(AutoRefreshService);
  readonly dialog = inject(MatDialog);
  readonly dashboardIndexService = inject(DashboardIndexService);
  readonly router = inject(Router);

  abstract readonly indexService: IndexServiceInterface<K, O>;
  abstract readonly filtersService: FiltersServiceInterface<F, E>;

  abstract tableType: TableType;

  displayedColumns: TableColumn<K>[] = [];
  displayedColumnsKeys: K[] = [];
  availableColumns: K[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<K, string> = {} as Record<K, string>;

  isLoading = true;
  isLoading$: Subject<boolean> = new BehaviorSubject<boolean>(true);

  options: O;

  filters: F;
  filters$: Subject<F>;

  intervalValue = 0;
  sharableURL = '';

  refresh$: Subject<void> = new Subject<void>();
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.autoRefreshService.createInterval(this.interval, this.stopInterval);

  subscriptions: Subscription = new Subscription();

  initTableEnvironment() {
    this.initColumns();
    this.initFilters();
    this.initOptions();
    this.intervalValue = this.indexService.restoreIntervalValue();
    this.sharableURL = this.shareUrlService.generateSharableURL(this.options, this.filters);
  }

  protected initColumns() {
    this.displayedColumnsKeys = this.indexService.restoreColumns();
    this.updateDisplayedColumns();
    this.availableColumns = this.indexService.availableTableColumns.map(column => column.key);
    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this.indexService.restoreLockColumns();
  }

  private initFilters() {
    this.filters = this.filtersService.restoreFilters();
    this.filters$ = new BehaviorSubject(this.filters);
  }

  private initOptions() {
    this.options = this.indexService.restoreOptions();
  }

  mergeSubscriptions() {
    const mergeSubscription = merge(this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    const loadingSubscription = this.isLoading$.subscribe(isLoading => this.isLoading = isLoading);
    this.subscriptions.add(mergeSubscription);
    this.subscriptions.add(loadingSubscription);
  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.displayedColumnsKeys.map(key => this.indexService.availableTableColumns.find(column => column.key === key) as TableColumn<K>);
  }

  getPageIcon(name: Page): string {
    return this.iconsService.getPageIcon(name);
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
    this.intervalValue = value;

    if (value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this.indexService.saveIntervalValue(value);
  }

  onColumnsChange(columns: K[]) {
    this.displayedColumnsKeys = [...columns];
    this.updateDisplayedColumns();
    this.indexService.saveColumns(columns);
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this.indexService.resetColumns();
    this.updateDisplayedColumns();
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as F;

    this.filtersService.saveFilters(value as F);
    this.options.pageIndex = 0;
    this.filters$.next(this.filters);
  }

  onFiltersReset(): void {
    this.filters = this.filtersService.resetFilters();
    this.options.pageIndex = 0;
    this.filters$.next([] as unknown as F);
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this.indexService.saveLockColumns(this.lockColumns);
  }

  autoRefreshTooltip() {
    return this.autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  onAddToDashboard() {
    const index = this.dashboardIndexService.addLine({
      name: this.tableType,
      type: this.tableType,
      interval: 10,
      filters: this.filters,
      options: this.options,
      displayedColumns: this.displayedColumnsKeys,
      lockColumns: this.lockColumns
    }, true);
    this.router.navigate(['/dashboard'], {fragment: `${this.tableType}-${index}`});
  }
}

export abstract class TableHandlerCustomValues<K extends RawCustomColumnKey, O extends IndexListOptions, F extends RawFilters, E extends FiltersEnums> extends TableHandler<K, O, F, E> {

  abstract override readonly indexService: IndexServiceCustomInterface<K, O>;

  customColumns: CustomColumn[];

  protected override initColumns() {
    this.displayedColumnsKeys = this.indexService.restoreColumns();
    this.availableColumns = this.indexService.availableTableColumns.map(column => column.key);
    this.customColumns = this.indexService.restoreCustomColumns();
    this.availableColumns.push(...this.customColumns as K[]);
    this.lockColumns = this.indexService.restoreLockColumns();
    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.updateDisplayedColumns();
  }

  override updateDisplayedColumns(): void {
    this.displayedColumns = this.displayedColumnsKeys.map(key => {
      if (key.includes('options.options.')) {
        const customColumnName = key.replaceAll('options.options.', '');
        return {
          key: key,
          name: customColumnName,
          sortable: true,
        } as TableColumn<K>;
      } else {
        return this.indexService.availableTableColumns.find(column => column.key === key) as TableColumn<K>;
      }
    });
  }

  addCustomColumn(): void {
    const dialogRef = this.dialog.open<ManageCustomColumnDialogComponent, CustomColumn[], CustomColumn[]>(ManageCustomColumnDialogComponent, {
      data: this.customColumns
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.customColumns = result;
        this.availableColumns = this.availableColumns.filter(column => !column.startsWith('options.options.'));
        this.availableColumns.push(...result as K[]);
        this.displayedColumnsKeys = this.displayedColumnsKeys.filter(column => !column.startsWith('options.options.'));
        this.displayedColumnsKeys.push(...result as K[]);
        this.updateDisplayedColumns();
        this.indexService.saveColumns(this.displayedColumnsKeys);
        this.indexService.saveCustomColumns(this.customColumns);
      }
    });
  }
}