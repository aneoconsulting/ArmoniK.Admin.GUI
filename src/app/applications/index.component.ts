import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { DashboardStorageService } from '@app/dashboard/services/dashboard-storage.service';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { Page } from '@app/types/pages';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ApplicationsTableComponent } from './components/table.component';
import { ApplicationsFiltersService } from './services/applications-filters.service';
import { ApplicationsGrpcService } from './services/applications-grpc.service';
import { ApplicationsIndexService } from './services/applications-index.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFilter, ApplicationRawListOptions } from './types';

@Component({
  selector: 'app-applications-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('applications')"></mat-icon>
  <span matListItemTitle i18n="Page title"> Applications </span>
</app-page-header>

<mat-toolbar>
  <mat-toolbar-row>
    <app-table-actions-toolbar
      [loading]="isLoading"
      [refreshTooltip]="autoRefreshTooltip()"
      [intervalValue]="intervalValue"
      [columnsLabels]="columnsLabels()"
      [displayedColumns]="displayedColumns"
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

<app-application-table 
  [data]="data"
  [filters]="filters"
  [displayedColumns]="displayedColumns"
  [lockColumns]="lockColumns"
  [options]="options"
  [total]="total"
  (optionsChange)="onOptionsChange()"
></app-application-table>
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
    TableService,
    TableURLService,
    TableStorageService,
    StorageService,
    UtilsService,
    AutoRefreshService,
    ApplicationsIndexService,
    ApplicationsGrpcService,
    NotificationService,
    TasksStatusesService,
    ApplicationsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: ApplicationsFiltersService
    },
    DashboardStorageService
  ],
  imports: [
    NoWrapDirective,
    CountTasksByStatusComponent,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
    ApplicationsTableComponent
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly #notificationService = inject(NotificationService);
  readonly #iconsService = inject(IconsService);
  readonly #applicationsFiltersService = inject(DATA_FILTERS_SERVICE);

  displayedColumns: ApplicationRawColumnKey[] = [];
  availableColumns: ApplicationRawColumnKey[] = [];
  lockColumns: boolean = false;

  isLoading = true;
  data: ApplicationRaw[] = [];
  total = 0;

  options: ApplicationRawListOptions;

  filters: ApplicationRawFilter = [];

  intervalValue = 0;
  sharableURL = '';

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);
  optionsChange: Subject<void> = new Subject<void>();

  subscriptions: Subscription = new Subscription();

  constructor(
    private _shareURLService: ShareUrlService,
    private _applicationsIndexService: ApplicationsIndexService,
    private _applicationsGrpcService: ApplicationsGrpcService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit(): void {
    this.displayedColumns = this._applicationsIndexService.restoreColumns();
    this.availableColumns = this._applicationsIndexService.availableColumns;
    this.lockColumns = this._applicationsIndexService.restoreLockColumns();

    this.options = this._applicationsIndexService.restoreOptions();

    this.filters = this.#applicationsFiltersService.restoreFilters();

    this.intervalValue = this._applicationsIndexService.restoreIntervalValue();

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
          this._applicationsIndexService.saveOptions(this.options);

          return this._applicationsGrpcService.list$(this.options, filters).pipe(catchError((error) => {
            console.error(error);
            this.#notificationService.error('Unable to fetch applications');
            return of(null);
          }));
        }),
        map(data => {
          this.isLoading = false;
          this.total = data?.total ?? 0;

          const partitions = data?.applications ?? [];

          return partitions;
        })
      )
      .subscribe(data => {
        this.data = data;
      });

    this.handleAutoRefreshStart();

    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  columnsLabels(): Record<ApplicationRawColumnKey, string> {
    return this._applicationsIndexService.columnsLabels;
  }

  getPageIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
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

    this._applicationsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: ApplicationRawColumnKey[]) {
    this.displayedColumns = data;

    this._applicationsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumns = this._applicationsIndexService.resetColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as ApplicationRawFilter;

    this.#applicationsFiltersService.saveFilters(filters as ApplicationRawFilter);
    this.options.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this.#applicationsFiltersService.resetFilters();
    this.options.pageIndex = 0;
    this.refresh.next();
  }

  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this._applicationsIndexService.saveLockColumns(this.lockColumns);
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
