import { inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { TableLine } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { ManageCustomColumnDialogComponent } from '@components/manage-custom-dialog.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableColumn } from '../column.type';
import { ColumnKey, CustomColumn, DataRaw } from '../data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '../filters';
import { ListOptions } from '../options';
import { FiltersServiceInterface } from '../services/filtersService';
import { IndexServiceCustomInterface, IndexServiceInterface } from '../services/indexService';
import { TableType } from '../table';

export abstract class TableHandler<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> {
  readonly shareUrlService = inject(ShareUrlService);
  readonly iconsService = inject(IconsService);
  readonly autoRefreshService = inject(AutoRefreshService);
  readonly dialog = inject(MatDialog);
  readonly dashboardIndexService = inject(DashboardIndexService);
  readonly router = inject(Router);

  abstract readonly indexService: IndexServiceInterface<T, O>;
  abstract readonly filtersService: FiltersServiceInterface<F, FO>;

  abstract tableType: TableType;

  displayedColumns: TableColumn<T, O>[] = [];
  displayedColumnsKeys: ColumnKey<T, O>[] = [];
  availableColumns: ColumnKey<T, O>[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<ColumnKey<T, O>, string> = {} as Record<ColumnKey<T, O>, string>;

  loading = signal(false);

  options: ListOptions<T, O>;

  filters: FiltersOr<F, FO>;
  filters$: Subject<FiltersOr<F, FO>>;
  showFilters: boolean;

  intervalValue = 0;
  sharableURL = '';

  refresh$: Subject<void> = new Subject<void>();
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
    this.showFilters = this.filtersService.restoreShowFilters();
    this.filters$ = new BehaviorSubject(this.filters);
  }

  private initOptions() {
    this.options = this.indexService.restoreOptions();
  }

  mergeSubscriptions() {
    const mergeSubscription = merge(this.interval$).subscribe(() => this.refresh$.next());
    this.subscriptions.add(mergeSubscription);
    this.handleAutoRefreshStart();
  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.displayedColumnsKeys.map(key => this.indexService.availableTableColumns.find(column => column.key === key) as TableColumn<T, O>);
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  onRefresh() {
    this.refresh$.next();
  }

  onIntervalValueChange(value: number) {
    this.intervalValue = value;

    if (value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh$.next();
    }

    this.indexService.saveIntervalValue(value);
  }

  onColumnsChange(columns: ColumnKey<T, O>[]) {
    if ((columns as string[]).includes('select')) {
      columns = ['select' as ColumnKey<T, O>, ...columns.filter(column => column !== 'select')];
    }
    this.displayedColumnsKeys = [...columns];
    this.updateDisplayedColumns();
    this.indexService.saveColumns(columns);
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this.indexService.resetColumns();
    this.updateDisplayedColumns();
  }

  onFiltersChange(value: FiltersOr<F, FO>) {
    this.filters = value;

    this.filtersService.saveFilters(value);
    this.options.pageIndex = 0;
    this.filters$.next(this.filters);
  }

  onFiltersReset(): void {
    this.filters = this.filtersService.resetFilters();
    this.options.pageIndex = 0;
    this.filters$.next([]);
  }

  onShowFiltersChange(value: boolean) {
    this.showFilters = value;
    this.filtersService.saveShowFilters(value);
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this.indexService.saveLockColumns(this.lockColumns);
  }

  autoRefreshTooltip() {
    return this.autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  handleAutoRefreshStart() {
    this.refresh$.next();
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  onAddToDashboard() {
    this.dashboardIndexService.addLine<TableLine<T, O>>({
      name: this.tableType,
      type: this.tableType,
      interval: 10,
      filters: this.filters,
      options: this.options,
      displayedColumns: this.displayedColumnsKeys,
      lockColumns: this.lockColumns,
      showFilters: this.showFilters
    });
    this.router.navigate(['/dashboard']);
  }
}

export abstract class TableHandlerCustomValues<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> extends TableHandler<T, F, O, FO> {

  abstract override readonly indexService: IndexServiceCustomInterface<T, O>;

  customColumns: CustomColumn[];

  protected override initColumns() {
    this.customColumns = this.indexService.restoreCustomColumns();
    this.displayedColumnsKeys = [...this.indexService.restoreColumns()];
    this.availableColumns = this.indexService.availableTableColumns.map(column => column.key);
    this.availableColumns.push(...this.customColumns as ColumnKey<T, O>[]);
    this.lockColumns = this.indexService.restoreLockColumns();
    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.updateDisplayedColumns();
  }

  override updateDisplayedColumns(): void {
    this.displayedColumns = this.displayedColumnsKeys.map(key => {
      if (key.toString().includes('options.options.')) {
        const customColumnName = key.toString().replaceAll('options.options.', '');
        return {
          key: key,
          name: customColumnName,
          sortable: true,
        } as TableColumn<T, O>;
      } else {
        return this.indexService.availableTableColumns.find(column => column.key === key) as TableColumn<T, O>;
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
        this.availableColumns = this.availableColumns.filter(column => !column.toString().startsWith('options.options.'));
        this.availableColumns.push(...result as ColumnKey<T, O>[]);
        this.displayedColumnsKeys = this.displayedColumnsKeys.filter(column => !column.toString().startsWith('options.options.'));
        this.displayedColumnsKeys.push(...result as ColumnKey<T, O>[]);
        this.updateDisplayedColumns();
        this.indexService.saveColumns(this.displayedColumnsKeys);
        this.indexService.saveCustomColumns(this.customColumns);
      }
    });
  }

  override onAddToDashboard() {
    this.dashboardIndexService.addLine<TableLine<T, O>>({
      name: this.tableType,
      type: this.tableType,
      interval: 10,
      filters: this.filters,
      options: this.options,
      displayedColumns: this.displayedColumnsKeys,
      lockColumns: this.lockColumns,
      showFilters: this.showFilters,
      customColumns: this.customColumns
    });
    this.router.navigate(['/dashboard']);
  }
}