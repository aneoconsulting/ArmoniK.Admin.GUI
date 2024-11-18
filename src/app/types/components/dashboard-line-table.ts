import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditNameLineDialogComponent } from '@app/dashboard/components/edit-name-line-dialog.component';
import { TableLine } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { ManageCustomColumnDialogComponent } from '@components/manage-custom-dialog.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { TableColumn } from '../column.type';
import { ScopeConfig } from '../config';
import { ColumnKey, CustomColumn, DataRaw } from '../data';
import { EditNameLineData } from '../dialog';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '../filters';
import { ListOptions } from '../options';
import { IndexServiceCustomInterface, IndexServiceInterface } from '../services/indexService';

@Component({
  selector: 'app-dashboard-line-table',
  template: ''
})
export abstract class DashboardLineTableComponent<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> {
  readonly autoRefreshService = inject(AutoRefreshService);
  readonly iconsService = inject(IconsService);
  readonly defaultConfigService = inject(DefaultConfigService);
  readonly dialog = inject(MatDialog);
  readonly notificationService = inject(NotificationService);

  abstract readonly indexService: IndexServiceInterface<T, O>;
  abstract readonly defaultConfig: ScopeConfig<T, F, O, FO>;
  
  @Input({ required: true }) line: TableLine<T, O>;
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<TableLine<T, O>> = new EventEmitter<TableLine<T, O>>();

  loading = signal(false);

  filters: FiltersOr<F, FO>;
  filters$: Subject<FiltersOr<F, FO>>;
  showFilters: boolean;

  options: ListOptions<T, O>;

  displayedColumnsKeys: ColumnKey<T, O>[] = [];
  readonly displayedColumns = signal<TableColumn<T, O>[]>([]);
  availableColumns: ColumnKey<T, O>[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<ColumnKey<T, O>, string> = {} as Record<ColumnKey<T, O>, string>;

  intervalValue: number;

  refresh$: Subject<void> = new Subject<void>();
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  subscriptions: Subscription = new Subscription();
  interval$: Observable<number> = this.autoRefreshService.createInterval(this.interval, this.stopInterval);

  initLineEnvironment() {
    this.initColumns();
    this.initOptions();
    this.initFilters();
    this.initFilters();
    this.initInterval();
  }

  initColumns() {
    this.availableColumns = this.indexService.availableTableColumns.map(c => c.key);
    this.displayedColumnsKeys = this.line.displayedColumns ?? this.indexService.defaultColumns;
    this.updateDisplayedColumns();
    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this.line.lockColumns ?? this.defaultConfig.lockColumns;
  }

  initFilters() {
    this.filters = this.line.filters as FiltersOr<F, FO>;
    this.showFilters = this.line.showFilters ?? this.defaultConfig.showFilters;
    this.filters$ = new BehaviorSubject(this.filters);
  }

  initInterval() {
    this.intervalValue = this.line.interval ?? 10;
    this.interval.next(this.line.interval);
  }

  initOptions() {
    this.options = (this.line.options as ListOptions<T, O>) ?? this.defaultConfig.options;
  }

  mergeSubscriptions() {
    const mergeSubscription = merge(this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    this.subscriptions.add(mergeSubscription);
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

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
    this.line.interval = value;

    if(value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this.lineChange.emit();

  }

  handleAutoRefreshStart() {
    this.refresh$.next();
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
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

  onFiltersChange(value: FiltersOr<F, FO>) {
    this.filters = value;
    this.line.filters = value as [];
    this.lineChange.emit();
    this.filters$.next(this.filters);
  }

  onFiltersReset() {
    this.filters = [];
    this.line.filters = [];
    this.lineChange.emit();
    this.filters$.next([]);
  }

  onShowFiltersChange(value: boolean) {
    this.showFilters = value;
    this.line.showFilters = value;
    this.lineChange.emit();
  }

  onColumnsChange(data: ColumnKey<T, O>[]) {
    this.displayedColumnsKeys = data;
    this.updateDisplayedColumns();
    this.line.displayedColumns = data;
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
    this.customColumns = this.line.customColumns ?? [];
    this.displayedColumnsKeys = [...(this.line.displayedColumns as ColumnKey<T, O>[] ?? this.indexService.defaultColumns)];
    this.availableColumns = this.indexService.availableTableColumns.map(column => column.key);
    this.availableColumns.push(...this.customColumns as ColumnKey<T, O>[]);
    this.lockColumns = this.line.lockColumns ?? false;
    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.updateDisplayedColumns();
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
        this.availableColumns = this.availableColumns.filter(column => !column.toString().startsWith('options.options.'));
        this.availableColumns.push(...result as ColumnKey<T, O>[]);
        this.displayedColumnsKeys = this.displayedColumnsKeys.filter(column => !column.toString().startsWith('options.options.'));
        this.displayedColumnsKeys.push(...result as ColumnKey<T, O>[]);
        this.updateDisplayedColumns();
        this.line.displayedColumns = this.displayedColumnsKeys;
        this.line.customColumns = result;
      }
    });
  }
}