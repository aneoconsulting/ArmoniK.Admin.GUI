import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableColumn } from '@components/table/column.type';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { AutoRefreshService } from '@services/auto-refresh.service';
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
import { ResultsTableComponent } from './components/table.component';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsIndexService } from './services/results-index.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw, ResultRawColumnKey, ResultRawFilters, ResultRawListOptions } from './types';

@Component({
  selector: 'app-results-index',
  templateUrl: './index.component.html',
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
    UtilsService,
    TableURLService,
    TableService,
    ResultsIndexService,
    ResultsGrpcService,
    AutoRefreshService,
    NotificationService,
    ResultsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: ResultsFiltersService,
    },
    ResultsStatusesService,
    TableStorageService,
    TasksByStatusService,
  ],
  imports: [
    NoWrapDirective,
    EmptyCellPipe,
    NgIf,
    NgFor,
    DatePipe,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    TableEmptyDataComponent,
    ResultsTableComponent,
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly #notificationService = inject(NotificationService);
  readonly #iconsService = inject(IconsService);
  readonly #resultsFiltersService = inject(DATA_FILTERS_SERVICE);
  readonly _shareURLService = inject(ShareUrlService);
  readonly _resultsIndexService = inject(ResultsIndexService);
  readonly _resultsGrpcService = inject(ResultsGrpcService);
  readonly _autoRefreshService = inject(AutoRefreshService);

  displayedColumns: TableColumn<ResultRawColumnKey>[] = [];
  displayedColumnsKeys: ResultRawColumnKey[] = [];
  availableColumns: ResultRawColumnKey[] = [];
  lockColumns: boolean = false;

  columnsLabels: Record<ResultRawColumnKey, string> = {} as Record<ResultRawColumnKey, string>;

  isLoading = true;
  data: ResultRaw[] = [];
  total = 0;

  options: ResultRawListOptions;

  filters: ResultRawFilters = [];

  intervalValue = 0;
  sharableURL = '';

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);
  optionsChange: Subject<void> = new Subject<void>();

  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.displayedColumnsKeys = this._resultsIndexService.restoreColumns();
    this.updateDisplayedColumns();
    this.availableColumns = this._resultsIndexService.availableTableColumns.map(column => column.key);
    this._resultsIndexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });

    this.lockColumns = this._resultsIndexService.restoreLockColumns();

    this.options = this._resultsIndexService.restoreOptions();

    this.filters = this.#resultsFiltersService.restoreFilters();

    this.intervalValue = this._resultsIndexService.restoreIntervalValue();

    this.sharableURL = this._shareURLService.generateSharableURL(this.options, this.filters);
  }

  ngAfterViewInit(): void {
    const mergeSubscription = merge(this.optionsChange, this.refresh, this.interval$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;

          const filters = this.filters;

          this.sharableURL = this._shareURLService.generateSharableURL(this.options, filters);
          this._resultsIndexService.saveOptions(this.options);

          return this._resultsGrpcService.list$(this.options, filters).pipe(catchError((error) => {
            console.error(error);
            this.#notificationService.error('Unable to fetch results');
            return of(null);
          }));
        }),
        map(data => {
          this.isLoading = false;
          this.total = data?.total ?? 0;

          const results = data?.results ?? [];

          return results;
        })
      ).subscribe(
        data => {
          this.data = data;
        });

    this.handleAutoRefreshStart();

    this.subscriptions.add(mergeSubscription);
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.displayedColumnsKeys.map(key => this._resultsIndexService.availableTableColumns.find(column => column.key === key) as TableColumn<ResultRawColumnKey>);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getPageIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
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

    this._resultsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: ResultRawColumnKey[]) {
    this.displayedColumnsKeys = [...data];
    this.updateDisplayedColumns();
    this._resultsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this._resultsIndexService.resetColumns();
    this.updateDisplayedColumns();
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as ResultRawFilters;

    this.#resultsFiltersService.saveFilters(value as ResultRawFilters);
    this.options.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset(): void {
    this.filters = this.#resultsFiltersService.resetFilters();
    this.options.pageIndex = 0;
    this.refresh.next();
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this._resultsIndexService.saveLockColumns(this.lockColumns);
  }

  autoRefreshTooltip() {
    return this._autoRefreshService.autoRefreshTooltip(this.intervalValue);
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
