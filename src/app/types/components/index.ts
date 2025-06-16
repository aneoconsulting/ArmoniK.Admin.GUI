import { inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { TableLine } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { ManageCustomColumnDialogComponent } from '@components/manage-custom-dialog.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { TableColumn } from '../column.type';
import { ColumnKey, CustomColumn, DataRaw } from '../data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '../filters';
import { DataFilterService } from '../services/data-filter.service';
import { IndexServiceCustomInterface, IndexServiceInterface } from '../services/indexService';
import { AbstractTableDataService } from '../services/table-data.service';
import { TableType } from '../table';

export abstract class TableHandler<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> {
  readonly shareUrlService = inject(ShareUrlService);
  readonly iconsService = inject(IconsService);
  readonly autoRefreshService = inject(AutoRefreshService);
  readonly dialog = inject(MatDialog);
  readonly dashboardIndexService = inject(DashboardIndexService);
  readonly router = inject(Router);

  abstract readonly indexService: IndexServiceInterface<T, O>;
  abstract readonly filtersService: DataFilterService<F, FO>;
  abstract readonly tableDataService: AbstractTableDataService<T, F, O, FO>;

  abstract tableType: TableType;

  readonly displayedColumns = signal<TableColumn<T, O>[]>([]);
  displayedColumnsKeys: ColumnKey<T, O>[] = [];
  availableColumns: TableColumn<T, O>[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<ColumnKey<T, O>, string> = {} as Record<ColumnKey<T, O>, string>;

  showFilters: boolean;

  intervalValue = 0;
  sharableURL = '';
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.autoRefreshService.createInterval(this.interval, this.stopInterval);

  subscriptions: Subscription = new Subscription();

  get options() {
    return this.tableDataService.options;
  }

  get filters() {
    return this.tableDataService.filters;
  }

  get loading() {
    return this.tableDataService.loading;
  }

  initTableEnvironment() {
    this.initColumns();
    this.updateDisplayedColumns();
    this.initFilters();
    this.initOptions();
    this.intervalValue = this.indexService.restoreIntervalValue();
    this.sharableURL = this.shareUrlService.generateSharableURL(this.options, this.filters);
  }

  protected initColumns() {
    this.displayedColumnsKeys = this.indexService.restoreColumns();
    this.availableColumns = this.indexService.availableTableColumns;
    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this.indexService.restoreLockColumns();
  }

  private initFilters() {
    this.tableDataService.filters = this.filtersService.restoreFilters();
    this.showFilters = this.filtersService.restoreShowFilters();
  }

  private initOptions() {
    this.tableDataService.options = this.indexService.restoreOptions();
  }

  mergeSubscriptions() {
    const intervalSubscription = this.interval$.subscribe(() => this.refresh());
    this.subscriptions.add(intervalSubscription);
    this.handleAutoRefreshStart();
  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns(): void {
    this.displayedColumns.set(
      this.displayedColumnsKeys.map(key => this.indexService.availableTableColumns.find(column => column.key === key) as TableColumn<T, O>)
    );
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  refresh() {
    this.tableDataService.refresh$.next();
  }

  onIntervalValueChange(value: number) {
    this.intervalValue = value;

    if (value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh();
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

  onOptionsChange() {
    this.indexService.saveOptions(this.options);
    this.refresh();
  }

  onFiltersChange(value: FiltersOr<F, FO>) {
    this.tableDataService.options.pageIndex = 0;
    this.tableDataService.filters = value;
    this.filtersService.saveFilters(this.filters);
    this.refresh();
  }

  onFiltersReset(): void {
    this.tableDataService.options.pageIndex = 0;
    this.tableDataService.filters = this.filtersService.resetFilters();
    this.refresh();
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
    this.refresh();
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  onAddToDashboard() {
    this.dashboardIndexService.addLine<TableLine<T, O>>(this.createDashboardLine());
    this.router.navigate(['/dashboard']);
  }

  protected createDashboardLine(): TableLine<T, O> {
    return {
      name: this.tableType,
      type: this.tableType,
      interval: 10,
      filters: this.filters,
      options: this.options,
      displayedColumns: this.displayedColumnsKeys,
      lockColumns: this.lockColumns,
      showFilters: this.showFilters
    };
  }
}

export abstract class TableHandlerCustomValues<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> extends TableHandler<T, F, O, FO> {
  abstract override readonly indexService: IndexServiceCustomInterface<T, O>;

  customColumns: CustomColumn[];

  protected override initColumns() {
    super.initColumns();
    this.customColumns = this.indexService.restoreCustomColumns();
  }

  override updateDisplayedColumns(): void {
    this.displayedColumns.set(
      this.displayedColumnsKeys.map(key => {
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
      })
    );
  }

  addCustomColumn(): void {
    const dialogRef = this.dialog.open<ManageCustomColumnDialogComponent, CustomColumn[], CustomColumn[]>(ManageCustomColumnDialogComponent, {
      data: this.customColumns
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.customColumns = result;
        this.displayedColumnsKeys = this.displayedColumnsKeys.filter(column => !column.toString().startsWith('options.options.'));
        this.displayedColumnsKeys.push(...result as ColumnKey<T, O>[]);
        this.updateDisplayedColumns();
        this.indexService.saveColumns(this.displayedColumnsKeys);
        this.indexService.saveCustomColumns(this.customColumns);
      }
    });
  }

  override createDashboardLine(): TableLine<T, O> {
    return {...super.createDashboardLine(), customColumns: this.customColumns};
  }
}