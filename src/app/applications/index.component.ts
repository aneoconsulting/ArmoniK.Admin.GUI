import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BehaviorSubject, Observable, Subject, Subscription, merge } from 'rxjs';
import { DashboardStorageService } from '@app/dashboard/services/dashboard-storage.service';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableColumn } from '@app/types/column.type';
import { Page } from '@app/types/pages';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ApplicationsTableComponent } from './components/table.component';
import { ApplicationsFiltersService } from './services/applications-filters.service';
import { ApplicationsIndexService } from './services/applications-index.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFilters, ApplicationRawListOptions } from './types';

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

<app-application-table
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
    TableService,
    TableURLService,
    TableStorageService,
    StorageService,
    UtilsService,
    AutoRefreshService,
    ApplicationsIndexService,
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
  readonly #iconsService = inject(IconsService);
  readonly #applicationsFiltersService = inject(DATA_FILTERS_SERVICE);

  displayedColumnsKeys: ApplicationRawColumnKey[] = [];
  displayedColumns: TableColumn<ApplicationRawColumnKey>[] = [];
  availableColumns: ApplicationRawColumnKey[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<ApplicationRawColumnKey, string> = {} as unknown as Record<ApplicationRawColumnKey, string>;

  isLoading = true;
  isLoading$: Subject<boolean> = new BehaviorSubject(true);
  data$: Subject<ApplicationRaw[]> = new Subject();
  total = 0;

  options: ApplicationRawListOptions;

  filters: ApplicationRawFilters = [];

  intervalValue = 0;
  sharableURL = '';

  refresh$: Subject<void> = new Subject<void>();
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);
  optionsChange: Subject<void> = new Subject<void>();

  subscriptions: Subscription = new Subscription();

  constructor(
    private _shareURLService: ShareUrlService,
    private _applicationsIndexService: ApplicationsIndexService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit(): void {
    this.availableColumns = this._applicationsIndexService.availableTableColumns.map(c => c.key);
    this.displayedColumnsKeys = this._applicationsIndexService.restoreColumns();
    this.updateDisplayedColumns();
    this._applicationsIndexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.lockColumns = this._applicationsIndexService.restoreLockColumns();

    this.options = this._applicationsIndexService.restoreOptions();

    this.filters = this.#applicationsFiltersService.restoreFilters();

    this.intervalValue = this._applicationsIndexService.restoreIntervalValue();

    this.sharableURL = this._shareURLService.generateSharableURL(this.options, this.filters);
  }

  ngAfterViewInit(): void {
    merge(this.optionsChange, this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    this.isLoading$.subscribe(isLoading => this.isLoading = isLoading);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns() {
    this.displayedColumns = this.displayedColumnsKeys.map(key => this._applicationsIndexService.availableTableColumns.find(c => c.key === key)).filter(Boolean) as TableColumn<ApplicationRawColumnKey>[];
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
    this.displayedColumnsKeys = data;
    this.updateDisplayedColumns();
    this._applicationsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this._applicationsIndexService.resetColumns();
    this.updateDisplayedColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as ApplicationRawFilters;

    this.#applicationsFiltersService.saveFilters(filters as ApplicationRawFilters);
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
