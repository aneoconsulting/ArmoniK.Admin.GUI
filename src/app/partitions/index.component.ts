import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableColumn } from '@app/types/column.type';
import { TaskStatusColored } from '@app/types/dialog';
import { Page } from '@app/types/pages';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { UtilsService } from '@services/utils.service';
import { PartitionsTableComponent } from './components/table.component';
import { PartitionsFiltersService } from './services/partitions-filters.service';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsIndexService } from './services/partitions-index.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFilters, PartitionRawListOptions } from './types';

@Component({
  selector: 'app-partitions-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('partitions')"></mat-icon>
  <span i18n="Page title">Partitions</span>
</app-page-header>

<mat-toolbar>
  <mat-toolbar-row>
    <app-table-actions-toolbar
      [loading]="isLoading"
      [refreshTooltip]="autoRefreshTooltip()"
      [intervalValue]="intervalValue"
      [columnsLabels]="columnsLabels"
      [displayedColumns]="displayedColumnsKeys"
      [availableColumns]="availableColumns"
      [lockColumns]="lockColumns"
      (refresh)="onRefresh()"
      (intervalValueChange)="onIntervalValueChange($event)"
      (displayedColumnsChange)="onColumnsChange($event)"
      (resetColumns)="onColumnsReset()"
      (resetFilters)="onFiltersReset()"
      (lockColumnsChange)="onLockColumnsChange()"
      >
    </app-table-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row class="filters">
    <app-filters-toolbar [filters]="filters" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<app-partitions-table
  [filters]="filters"
  [displayedColumns]="displayedColumns"
  [lockColumns]="lockColumns"
  [options]="options"
  [refresh$]="refresh$"
  [loading$]="isLoading$"
/>
  `,
  styles: [`
app-table-actions-toolbar {
  flex-grow: 1;
}

.filters {
  height: auto;
  min-height: 64px;

  padding: 1rem;
}
  `],
  standalone: true,
  providers: [
    IconsService,
    ShareUrlService,
    QueryParamsService,
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    PartitionsIndexService,
    PartitionsGrpcService,
    NotificationService,
    TasksByStatusService,
    TasksStatusesService,
    TasksIndexService,
    FiltersService,
    PartitionsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: PartitionsFiltersService
    },
  ],
  imports: [
    NoWrapDirective,
    EmptyCellPipe,
    NgIf,
    NgFor,
    RouterLink,
    CountTasksByStatusComponent,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    TableInspectObjectComponent,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    TableEmptyDataComponent,
    PartitionsTableComponent
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly #iconsService = inject(IconsService);
  readonly #shareURLService = inject(ShareUrlService);
  readonly #partitionsIndexService = inject(PartitionsIndexService);
  readonly #autoRefreshService = inject(AutoRefreshService);
  readonly #partitionsFiltersService = inject(PartitionsFiltersService);

  displayedColumns: TableColumn<PartitionRawColumnKey>[] = [];
  availableColumns: PartitionRawColumnKey[] = [];
  displayedColumnsKeys: PartitionRawColumnKey[] = [];
  lockColumns: boolean;
  columnsLabels: Record<PartitionRawColumnKey, string> = {} as unknown as Record<PartitionRawColumnKey, string>;

  isLoading$: Subject<boolean> = new BehaviorSubject(true);
  isLoading = true;
  data$: Subject<PartitionRaw[]> = new Subject();
  total = 0;

  options: PartitionRawListOptions;

  filters: PartitionRawFilters = [];

  intervalValue = 0;
  sharableURL = '';

  refresh$: Subject<void> = new Subject<void>();
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);
  optionsChange: Subject<void> = new Subject<void>();

  tasksStatusesColored: TaskStatusColored[] = [];

  subscriptions: Subscription = new Subscription();

  ngOnInit() {
    this.displayedColumnsKeys = this.#partitionsIndexService.restoreColumns();
    this.availableColumns = this.#partitionsIndexService.availableTableColumns.map(c => c.key);
    this.updateDisplayedColumns();
    this.#partitionsIndexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this.#partitionsIndexService.restoreLockColumns();

    this.options = this.#partitionsIndexService.restoreOptions();

    this.filters = this.#partitionsFiltersService.restoreFilters();

    this.intervalValue = this.#partitionsIndexService.restoreIntervalValue();

    this.sharableURL = this.#shareURLService.generateSharableURL(this.options, this.filters);

  }

  ngAfterViewInit(): void {
    const mergeSubscription =  merge(this.optionsChange, this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    this.isLoading$.subscribe(isLoading => this.isLoading = isLoading);
    this.handleAutoRefreshStart();
    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsKeys.map(key => this.#partitionsIndexService.availableTableColumns.find(c => c.key === key)).filter(Boolean) as TableColumn<PartitionRawColumnKey>[];
  }

  getPageIcon(page: Page): string {
    return this.#iconsService.getPageIcon(page);
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

    this.#partitionsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: PartitionRawColumnKey[]) {
    this.displayedColumnsKeys = data;
    this.updateDisplayedColumns();
    this.#partitionsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this.#partitionsIndexService.resetColumns();
    this.updateDisplayedColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as PartitionRawFilters;

    this.#partitionsFiltersService.saveFilters(filters as PartitionRawFilters);
    this.options.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this.#partitionsFiltersService.resetFilters();
    this.options.pageIndex = 0;
    this.refresh.next();
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this.#partitionsIndexService.saveLockColumns(this.lockColumns);
  }

  autoRefreshTooltip() {
    return this.#autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  onOptionsChange() {
    this.optionsChange.next();
  }
}
