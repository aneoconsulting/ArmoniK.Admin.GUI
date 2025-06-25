import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditNameLineDialogComponent } from '@app/dashboard/components/edit-name-line-dialog.component';
import { TableLine } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { ManageCustomColumnDialogComponent } from '@components/manage-custom-dialog.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { TableColumn } from '../column.type';
import { ScopeConfig } from '../config';
import { ColumnKey, CustomColumn, DataRaw } from '../data';
import { EditNameLineData } from '../dialog';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '../filters';
import { ListOptions } from '../options';
import { IndexServiceCustomInterface, IndexServiceInterface } from '../services/indexService';
import { AbstractTableDataService } from '../services/table-data.service';

@Component({
  selector: 'app-dashboard-line-table',
  template: ''
})
export abstract class DashboardLineTableComponent<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> {
  readonly autoRefreshService = inject(AutoRefreshService);
  readonly iconsService = inject(IconsService);
  readonly defaultConfigService = inject(DefaultConfigService);
  readonly dialog = inject(MatDialog);

  abstract readonly tableDataService: AbstractTableDataService<T, F, O, FO>;
  abstract readonly indexService: IndexServiceInterface<T, O>;
  abstract readonly defaultConfig: ScopeConfig<T, F, O, FO>;
  
  @Input({ required: true }) line: TableLine<T, O>;
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<TableLine<T, O>> = new EventEmitter<TableLine<T, O>>();

  showFilters: boolean;

  displayedColumnsKeys: ColumnKey<T, O>[] = [];
  readonly displayedColumns = signal<TableColumn<T, O>[]>([]);
  availableColumns: TableColumn<T, O>[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<ColumnKey<T, O>, string> = {} as Record<ColumnKey<T, O>, string>;

  intervalValue: number;

  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  subscriptions: Subscription = new Subscription();
  interval$: Observable<number> = this.autoRefreshService.createInterval(this.interval, this.stopInterval);

  get options() {
    return this.tableDataService.options;
  }

  get filters() {
    return this.tableDataService.filters;
  }

  get loading() {
    return this.tableDataService.loading;
  }

  initLineEnvironment() {
    this.initColumns();
    this.updateDisplayedColumns();
    this.initOptions();
    this.initFilters();
    this.initFilters();
    this.initInterval();
    this.handleAutoRefreshStart();
  }

  initColumns() {
    this.availableColumns = this.indexService.availableTableColumns;
    this.displayedColumnsKeys = this.line.displayedColumns ?? this.indexService.defaultColumns;

    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this.line.lockColumns ?? this.defaultConfig.lockColumns;
  }

  initFilters() {
    this.tableDataService.filters = this.line.filters as FiltersOr<F, FO>;
    this.showFilters = this.line.showFilters ?? this.defaultConfig.showFilters;
  }

  initInterval() {
    this.intervalValue = this.line.interval ?? 10;
    this.interval.next(this.line.interval);
  }

  initOptions() {
    this.tableDataService.options = (this.line.options as ListOptions<T, O>) ?? this.defaultConfig.options;
  }

  mergeSubscriptions() {
    const intervalSubscription = this.interval$.subscribe(() => this.refresh());
    this.subscriptions.add(intervalSubscription);
  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns() {
    this.displayedColumns.set(
      this.displayedColumnsKeys.map(key => this.indexService.availableTableColumns.find(c => c.key === key)).filter(Boolean) as TableColumn<T, O>[]
    );
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  autoRefreshTooltip(): string {
    return this.autoRefreshService.autoRefreshTooltip(this.line.interval);
  }

  refresh() {
    this.tableDataService.refresh$.next();
  }

  handleAutoRefreshStart() {
    this.refresh();
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  onIntervalValueChange(value: number) {
    this.line.interval = value;

    if(value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh();
    }
    this.lineChange.emit();
  }

  onEditNameLine() {
    const dialogRef: MatDialogRef<EditNameLineDialogComponent, string> = this.dialog.open<EditNameLineDialogComponent, EditNameLineData, string>(EditNameLineDialogComponent, {
      data: {
        name: this.line.name
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.line.name = result;
        this.lineChange.emit();
      }
    });
  }

  onDeleteLine(): void {
    this.lineDelete.emit(this.line);
  }

  onOptionsChange() {
    this.line.options = {...this.options};
    this.refresh();
  }

  onFiltersChange(value: FiltersOr<F, FO>) {
    this.tableDataService.filters = value;
    this.line.filters = value as [];
    this.tableDataService.options.pageIndex = 0;
    this.lineChange.emit();
  }

  onFiltersReset() {
    this.tableDataService.filters = [];
    this.line.filters = [];
    this.tableDataService.options.pageIndex = 0;
    this.lineChange.emit();
  }

  onShowFiltersChange(value: boolean) {
    this.showFilters = value;
    this.line.showFilters = value;
    this.lineChange.emit();
  }

  onColumnsChange(columns: ColumnKey<T, O>[]) {
    if ((columns as string[]).includes('select')) {
      columns = ['select' as ColumnKey<T, O>, ...columns.filter(column => column !== 'select')];
    }
    this.displayedColumnsKeys = columns;
    this.updateDisplayedColumns();
    this.line.displayedColumns = columns;
    this.lineChange.emit();
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this.indexService.defaultColumns;
    this.line.displayedColumns = this.indexService.defaultColumns;
    this.updateDisplayedColumns();
    this.lineChange.emit();
  }

  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this.line.lockColumns = this.lockColumns;
    this.lineChange.emit();
  }
}

@Component({
  selector: 'app-dashboard-line-table',
  template: ''
})
export abstract class DashboardLineCustomColumnsComponent<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> extends DashboardLineTableComponent<T, F, O, FO> {
  abstract override readonly indexService: IndexServiceCustomInterface<T, O>;

  customColumns: CustomColumn[];

  override initColumns() {
    super.initColumns();
    this.customColumns = this.line.customColumns ?? [];
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
        this.line.displayedColumns = this.displayedColumnsKeys;
        this.line.customColumns = result;
      }
    });
  }
}