import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { EditNameLineDialogComponent } from '@app/dashboard/components/edit-name-line-dialog.component';
import { Line } from '@app/dashboard/types';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { TableColumn } from '../column.type';
import { IndexListOptions, RawColumnKey } from '../data';
import { EditNameLineData, EditNameLineResult } from '../dialog';
import { RawFilters } from '../filters';
import { IndexServiceInterface } from '../services/indexService';

@Component({
  selector: 'app-dashboard-line-table',
  template: ''
})
export abstract class DashboardLineTableComponent<K extends RawColumnKey, O extends IndexListOptions, F extends RawFilters> {
  readonly autoRefreshService = inject(AutoRefreshService);
  readonly iconsService = inject(IconsService);
  readonly defaultConfigService = inject(DefaultConfigService);
  readonly dialog = inject(MatDialog);

  abstract readonly indexService: IndexServiceInterface<K, O>;
  
  @Input({ required: true }) line: Line;
  @Output() lineChange: EventEmitter<void> = new EventEmitter<void>();
  @Output() lineDelete: EventEmitter<Line> = new EventEmitter<Line>();

  loading: boolean = true;
  loading$: Subject<boolean> = new BehaviorSubject(true);

  filters: F;
  filters$: Subject<F>;

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
    this.displayedColumnsKeys = this.indexService.restoreColumns();
    this.updateDisplayedColumns();
    this.indexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this.line.lockColumns ?? this.defaultConfigService.defaultApplications.lockColumns;
  }

  initFilters() {
    this.filters = this.line.filters as F;
    this.filters$ = new BehaviorSubject(this.filters);
  }

  initInterval() {
    this.intervalValue = this.line.interval ?? 10;
    this.interval.next(this.line.interval);
  }

  initOptions() {
    this.options = (this.line.options as O) ?? this.defaultConfigService.defaultApplications.options;
  }

  mergeSubscriptions() {
    const mergeSubscription = merge(this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    const loadingSubscription = this.loading$.subscribe((value) => this.loading = value);
    this.subscriptions.add(mergeSubscription);
    this.subscriptions.add(loadingSubscription);
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

  onEditNameLine(value: string) {
    const dialogRef: MatDialogRef<EditNameLineDialogComponent, EditNameLineResult> = this.dialog.open<EditNameLineDialogComponent, EditNameLineData, EditNameLineResult>(EditNameLineDialogComponent, {
      data: {
        name: value
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.line.name = result.name;
        this.lineChange.emit();
      }
    });
  }

  onDeleteLine(value: Line): void {
    this.lineDelete.emit(value);
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

  onColumnsChange(data: K[]) {
    this.displayedColumnsKeys = data;
    this.updateDisplayedColumns();
    this.line.displayedColumns = data;
    this.lineChange.emit();
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this.indexService.resetColumns();
    this.line.displayedColumns = this.displayedColumnsKeys;
    this.updateDisplayedColumns();
    this.lineChange.emit();
  }

  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this.line.lockColumns = this.lockColumns;
    this.lineChange.emit();
  }
}