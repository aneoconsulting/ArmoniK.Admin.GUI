import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TaskStatusColored, ViewTasksByStatusDialogData } from '@app/types/dialog';
import { Page } from '@app/types/pages';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { ViewTasksByStatusDialogComponent } from '@components/view-tasks-by-status-dialog.component';
import { DurationPipe } from '@pipes/duration.pipe';
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
import { ApplicationsTableComponent } from './components/table.component';
import { SessionsFiltersService } from './services/sessions-filters.service';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRaw, SessionRawColumnKey, SessionRawFiltersOr, SessionRawListOptions } from './types';

@Component({
  selector: 'app-sessions-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('sessions')"></mat-icon>
  <span i18n="Page title"> Sessions </span>
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

<app-sessions-table
  [data]="data"
  [filters]="filters"
  [displayedColumns]="displayedColumns"
  [lockColumns]="lockColumns"
  [options]="options"
  [total]="total"
  (optionsChange)="onOptionsChange()"
></app-sessions-table>
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
    TasksByStatusService,
    IconsService,
    ShareUrlService,
    QueryParamsService,
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    SessionsIndexService,
    SessionsGrpcService,
    NotificationService,
    TasksByStatusService,
    TasksStatusesService,
    TasksIndexService,
    FiltersService,
    TasksFiltersService,
    SessionsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: SessionsFiltersService
    },
    SessionsStatusesService
  ],
  imports: [
    DurationPipe,
    EmptyCellPipe,
    NoWrapDirective,
    CountTasksByStatusComponent,
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    DragDropModule,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatTooltipModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDialogModule,
    ApplicationsTableComponent
  ]
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly #tasksByStatusService = inject(TasksByStatusService);
  readonly #notificationService = inject(NotificationService);
  readonly #sessionsFiltersService = inject(SessionsFiltersService);
  readonly _dialog = inject(MatDialog);
  readonly _tasksByStatusService = inject(TasksByStatusService);

  displayedColumns: SessionRawColumnKey[] = [];
  availableColumns: SessionRawColumnKey[] = [];
  lockColumns: boolean = false;

  isLoading = true;
  data: SessionRaw[] = [];
  total = 0;

  options: SessionRawListOptions;

  filters: SessionRawFiltersOr = [];

  intervalValue = 0;
  sharableURL = '';

  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  interval$: Observable<number> = this._autoRefreshService.createInterval(this.interval, this.stopInterval);
  optionsChange: Subject<void> = new Subject<void>();

  tasksStatusesColored: TaskStatusColored[] = [];

  subscriptions: Subscription = new Subscription();

  personnalizedTaskToolTip = $localize`Personalize Tasks Status`;

  constructor(
    private _iconsService: IconsService,
    private _shareURLService: ShareUrlService,
    private _sessionsIndexService: SessionsIndexService,
    private _sessionsGrpcService: SessionsGrpcService,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit() {
    this.displayedColumns = this._sessionsIndexService.restoreColumns();
    this.availableColumns = this._sessionsIndexService.availableColumns;
    this.lockColumns = this._sessionsIndexService.restoreLockColumns();

    this.options = this._sessionsIndexService.restoreOptions();

    this.filters = this.#sessionsFiltersService.restoreFilters();

    this.intervalValue = this._sessionsIndexService.restoreIntervalValue();

    this.sharableURL = this._shareURLService.generateSharableURL(this.options, this.filters);

    this.tasksStatusesColored = this.#tasksByStatusService.restoreStatuses('sessions');
  }

  ngAfterViewInit(): void {
    const mergeSubscription = merge(this.optionsChange, this.refresh, this.interval$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;

          const filters = this.filters;

          this.sharableURL = this._shareURLService.generateSharableURL(this.options, filters);
          this._sessionsIndexService.saveOptions(this.options);

          return this._sessionsGrpcService.list$(this.options, filters).pipe(catchError((error) => {
            console.error(error);
            this.#notificationService.error('Unable to fetch sessions');
            return of(null);
          }));
        }),
        map(data => {
          this.isLoading = false;
          this.total = data?.total ?? 0;

          const sessions = data?.sessions ?? [];
          return sessions;
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

  columnsLabels(): Record<SessionRawColumnKey, string> {
    return this._sessionsIndexService.columnsLabels;
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  getPageIcon(name: Page): string {
    return this._iconsService.getPageIcon(name);
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

    this._sessionsIndexService.saveIntervalValue(value);
  }

  onColumnsChange(data: SessionRawColumnKey[]) {
    this.displayedColumns = [...data];

    this._sessionsIndexService.saveColumns(data);
  }

  onColumnsReset() {
    this.displayedColumns = this._sessionsIndexService.resetColumns();
  }

  onFiltersChange(filters: unknown[]) {
    this.filters = filters as SessionRawFiltersOr;

    this.#sessionsFiltersService.saveFilters(filters as SessionRawFiltersOr);
    this.options.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset() {
    this.filters = this.#sessionsFiltersService.resetFilters();
    this.options.pageIndex = 0;
    this.refresh.next();
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this._sessionsIndexService.saveLockColumns(this.lockColumns);
  }

  autoRefreshTooltip() {
    return this._autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  onCancel(sessionId: string) {
    this._sessionsGrpcService.cancel$(sessionId).subscribe(
      () => this.refresh.next(),
    );
  }

  handleAutoRefreshStart() {
    if (this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  personalizeTasksByStatus() {
    const dialogRef = this._dialog.open<ViewTasksByStatusDialogComponent, ViewTasksByStatusDialogData>(ViewTasksByStatusDialogComponent, {
      data: {
        statusesCounts: this.tasksStatusesColored,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this.tasksStatusesColored = result;
      this._tasksByStatusService.saveStatuses('sessions', result);
    });
  }

  onOptionsChange() {
    this.optionsChange.next();
  }
  
  handleNestedKeys(nestedKeys: string, element: {[key: string]: object}) {
    const keys = nestedKeys.split('.');
    let resultObject: {[key: string]: object} = element;
    keys.forEach(key => {
      resultObject = resultObject[key] as unknown as {[key: string]: object};
    });
    return resultObject;
  }
}
