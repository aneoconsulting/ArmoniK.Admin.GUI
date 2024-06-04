import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { EditNameLineDialogComponent } from '@app/dashboard/components/edit-name-line-dialog.component';
import { Line } from '@app/dashboard/types';
import { ManageCustomColumnDialogComponent } from '@components/manage-custom-dialog.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TableColumn } from '../column.type';
import { ScopeConfig } from '../config';
import { CustomColumn, IndexListOptions, RawColumnKey } from '../data';
import { EditNameLineData, EditNameLineResult } from '../dialog';
import { RawFilters } from '../filters';
import { IndexServiceCustomInterface, IndexServiceInterface } from '../services/indexService';

@Component({
  selector: 'app-dashboard-line-table',
  template: ''
})
export abstract class DashboardLineTableComponent<K extends RawColumnKey, O extends IndexListOptions, F extends RawFilters> {
  readonly autoRefreshService = inject(AutoRefreshService);
  readonly iconsService = inject(IconsService);
  readonly defaultConfigService = inject(DefaultConfigService);
  readonly dialog = inject(MatDialog);
  readonly notificationService = inject(NotificationService);

  abstract readonly indexService: IndexServiceInterface<K, O>;
  abstract readonly defaultConfig: ScopeConfig<K, O, F>;
  
  @Input({ required: true }) line: Line;
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<Line> = new EventEmitter<Line>();

  loading = signal(true);

  filters: F;
  filters$: Subject<F>;
  showFilters: boolean;

  options: O;

  displayedColumnsKeys: K[] = [];
  displayedColumns: TableColumn<K>[] = [];
  availableColumns: K[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<K, string> = {} as unknown as Record<K, string>;

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
    this.displayedColumnsKeys = this.line.displayedColumns as K[] ?? this.indexService.defaultColumns;
    this.updateDisplayedColumns();
    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this.line.lockColumns ?? this.defaultConfig.lockColumns;
  }

  initFilters() {
    this.filters = this.line.filters as F;
    this.showFilters = this.line.showFilters ?? this.defaultConfig.showFilters;
    this.filters$ = new BehaviorSubject(this.filters);
  }

  initInterval() {
    this.intervalValue = this.line.interval ?? 10;
    this.interval.next(this.line.interval);
  }

  initOptions() {
    this.options = (this.line.options as O) ?? this.defaultConfig.options;
  }

  mergeSubscriptions() {
    const mergeSubscription = merge(this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    this.subscriptions.add(mergeSubscription);
  }

  unsubscribe() {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsKeys.map(key => this.indexService.availableTableColumns.find(c => c.key === key)).filter(Boolean) as TableColumn<K>[];
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

  onEditNameLine() {
    const dialogRef: MatDialogRef<EditNameLineDialogComponent, EditNameLineResult> = this.dialog.open<EditNameLineDialogComponent, EditNameLineData, EditNameLineResult>(EditNameLineDialogComponent, {
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

  onFiltersChange(value: unknown[]) {
    this.filters = value as F;
    this.line.filters = value as [];
    this.lineChange.emit();
    this.filters$.next(this.filters);
  }

  onFiltersReset() {
    this.filters = [] as unknown as F;
    this.line.filters = [];
    this.lineChange.emit();
    this.filters$.next([] as unknown as F);
  }

  onShowFiltersChange(value: boolean) {
    this.showFilters = value;
    this.line.showFilters = value;
    this.lineChange.emit();
  }

  onColumnsChange(data: K[]) {
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
export abstract class DashboardLineCustomColumnsComponent<K extends RawColumnKey, O extends IndexListOptions, F extends RawFilters> extends DashboardLineTableComponent<K, O, F> {
  abstract override readonly indexService: IndexServiceCustomInterface<K, O>;

  customColumns: CustomColumn[];

  override initColumns() {
    this.customColumns = this.line.customColumns ?? [];
    this.displayedColumnsKeys = [...(this.line.displayedColumns as K[] ?? this.indexService.defaultColumns)];
    this.availableColumns = this.indexService.availableTableColumns.map(column => column.key);
    this.availableColumns.push(...this.customColumns as K[]);
    this.lockColumns = this.line.lockColumns ?? false;
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
        const oldCustoms = this.customColumns;
        this.customColumns = result;
        this.availableColumns = this.availableColumns.filter(column => !column.startsWith('options.options.'));
        this.availableColumns.push(...result as K[]);
        this.displayedColumnsKeys = this.displayedColumnsKeys.filter(column => !column.startsWith('options.options.'));
        this.displayedColumnsKeys.push(...result.filter(column => !oldCustoms.includes(column)) as K[]);
        this.updateDisplayedColumns();
        this.line.displayedColumns = this.displayedColumnsKeys;
        this.line.customColumns = result;
      }
    });
  }
}