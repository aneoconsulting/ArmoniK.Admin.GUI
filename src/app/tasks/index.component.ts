import { FilterStringOperator, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { SelectionModel } from '@angular/cdk/collections';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Observable, Subject, Subscription, catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { ManageViewInLogsDialogData, ManageViewInLogsDialogResult } from '@app/types/dialog';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ManageViewInLogsDialogComponent } from './components/manage-view-in-logs-dialog.component';
import { TasksTableComponent } from './components/table.component';
import { TasksFiltersService } from './services/tasks-filters.service';
import { TasksGrpcService } from './services/tasks-grpc.service';
import { TasksIndexService } from './services/tasks-index.service';
import { TasksStatusesService } from './services/tasks-statuses.service';
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryFilter, TaskSummaryFiltersOr, TaskSummaryListOptions } from './types';

@Component({
  selector: 'app-tasks-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('tasks')"></mat-icon>
  <span i18n="Page title"> Tasks </span>
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
        <ng-container extra-buttons-right>
          <button mat-flat-button color="accent" (click)="onCancelTasksSelection()" [disabled]="!selection.selected.length">
            <mat-icon matListIcon aria-hidden="true" fontIcon="stop"></mat-icon>
            <span i18n> Cancel Tasks </span>
          </button>
        </ng-container>
        <ng-container extra-menu-items>
        <button mat-menu-item (click)="manageViewInLogs()">
          <mat-icon aria-hidden="true" [fontIcon]="getIcon('find-logs')"></mat-icon>
          <span i18n appNoWrap>
            Manage View in Logs
          </span>
        </button>
      </ng-container>
    </app-table-actions-toolbar>
  </mat-toolbar-row>

  <mat-toolbar-row class="filters">
    <app-filters-toolbar [filters]="filters" (filtersChange)="onFiltersChange($event)"></app-filters-toolbar>
  </mat-toolbar-row>
</mat-toolbar>

<app-tasks-table
  [data]="data"
  [displayedColumns]="displayedColumns"
  [interval]="interval"
  [intervalValue]="intervalValue"
  [lockColumns]="lockColumns"
  [options]="options"
  [selection]="selection"
  [stopInterval]="stopInterval"
  [serviceName]="serviceName"
  [serviceIcon]="serviceIcon"
  [urlTemplate]="urlTemplate"
  [total]="total"
  (optionsChange)="onOptionsChange()"
  (cancelTask)="onCancelTask($event)"
  (retries)="onRetries($event)"
></app-tasks-table>
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
  imports: [
    NgFor,
    NgIf,
    RouterModule,
    NoWrapDirective,
    FiltersToolbarComponent,
    TableActionsToolbarComponent,
    PageHeaderComponent,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    TasksTableComponent,
  ],
  providers: [
    TasksGrpcService,
    TasksFiltersService,
    TasksStatusesService,
    TasksIndexService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: TasksFiltersService
    },
    TableService,
    TableStorageService,
    TableURLService,
    NotificationService,
    AutoRefreshService,
    ShareUrlService,
    QueryParamsService,
    UtilsService,
    FiltersService,
  ],
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly #dialog = inject(MatDialog);
  readonly #iconsService = inject(IconsService);
  readonly #shareURLService = inject(ShareUrlService);
  readonly #autoRefreshService = inject(AutoRefreshService);
  readonly #tasksIndexService = inject(TasksIndexService);
  readonly #tasksGrpcService = inject(TasksGrpcService);
  readonly #notificationService = inject(NotificationService);
  readonly #tasksFiltersService = inject(TasksFiltersService);

  displayedColumns: TaskSummaryColumnKey[] = [];
  availableColumns: TaskSummaryColumnKey[] = [];
  lockColumns: boolean = false;

  selection = new SelectionModel<TaskSummary>(true, []);
  selectedRows: string[] = [];

  isLoading = true;
  data: TaskSummary[] = [];
  total = 0;

  taskId: string;

  options: TaskSummaryListOptions;

  filters: TaskSummaryFiltersOr = [];

  sharableURL = '';

  serviceIcon: string | null = null;
  serviceName: string | null = null;
  urlTemplate: string | null = null;

  intervalValue = 0;
  refresh: Subject<void> = new Subject<void>();
  stopInterval: Subject<void> = new Subject<void>();
  interval: Subject<number> = new Subject<number>();
  optionsChange: Subject<void> = new Subject<void>();
  interval$: Observable<number> = this.#autoRefreshService.createInterval(this.interval, this.stopInterval);

  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.displayedColumns = this.#tasksIndexService.restoreColumns();
    this.availableColumns = this.#tasksIndexService.availableColumns;
    this.lockColumns = this.#tasksIndexService.restoreLockColumns();

    this.options = this.#tasksIndexService.restoreOptions();

    this.filters = this.#tasksFiltersService.restoreFilters();

    this.intervalValue = this.#tasksIndexService.restoreIntervalValue();

    this.sharableURL = this.#shareURLService.generateSharableURL(this.options, this.filters);

    const viewInLogs = this.#tasksIndexService.restoreViewInLogs();
    this.serviceIcon = viewInLogs.serviceIcon;
    this.serviceName = viewInLogs.serviceName;
    this.urlTemplate = viewInLogs.urlTemplate;
  }

  ngAfterViewInit(): void {
    const mergeSubscription = merge(this.optionsChange, this.refresh, this.interval$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          this.selectedRows = this.selection.selected.map(task => task.id);
          this.selection.clear();

          const filters = this.filters;

          this.sharableURL = this.#shareURLService.generateSharableURL(this.options, filters);
          this.#tasksIndexService.saveOptions(this.options);

          return this.#tasksGrpcService.list$(this.options, filters).pipe(
            catchError((error) => {
              console.error(error);
              this.#notificationService.error('Unable to fetch tasks');
              return of(null);
            }),
          );
        }),
        map(data => {
          this.isLoading = false;

          this.total = data?.total ?? 0;

          const tasks = data?.tasks ?? [];
          return tasks;
        }),
      )
      .subscribe((data) => {
        this.data = data;
        if (this.selectedRows.length > 0) {
          if (this.selectedRows.length === data.length) {
            this.selection.select(...this.data);
          } else {
            this.selection.select(...(this.data.filter(task => this.selectedRows.includes(task.id))));
          }
        }
      });

    this.handleAutoRefreshStart();

    this.subscriptions.add(mergeSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onRetries(task: TaskSummary): void {
    const filter: TaskSummaryFilter = {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_INITIAL_TASK_ID,
      value: task.id,
      operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
    };

    this.onFiltersChange([filter]);
  }

  onRefresh() {
    this.refresh.next();
  }

  onIntervalValueChange(value: number) {
    this.intervalValue = value;

    if(value === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(value);
      this.refresh.next();
    }

    this.#tasksIndexService.saveIntervalValue(value);
  }

  onColumnsChange(columns: TaskSummaryColumnKey[]) {
    this.displayedColumns = [...columns];

    this.#tasksIndexService.saveColumns(columns);
  }

  onColumnsReset() {
    this.displayedColumns = this.#tasksIndexService.resetColumns();
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as TaskSummaryFiltersOr;

    this.#tasksFiltersService.saveFilters(this.filters);
    this.options.pageIndex = 0;
    this.refresh.next();
  }

  onFiltersReset(): void{
    this.filters = this.#tasksFiltersService.resetFilters();
    this.options.pageIndex = 0;
    this.refresh.next();
  }

  onCancelTask(taskId: string): void {
    this.cancelTasks([taskId]);
  }

  onCancelTasksSelection():void {
    const tasksIds = this.selection.selected.map((task) => task.id);
    this.cancelTasks(tasksIds);
  }
  
  onLockColumnsChange() {
    this.lockColumns = !this.lockColumns;
    this.#tasksIndexService.saveLockColumns(this.lockColumns);
  }

  cancelTasks(tasksIds: string[]): void {
    this.#tasksGrpcService.cancel$(tasksIds).subscribe({
      complete: () => {
        this.#notificationService.success('Tasks canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this.#notificationService.error('Unable to cancel tasks');
      },
    });
  }

  columnsLabels(): Record<TaskSummaryColumnKey, string> {
    return this.#tasksIndexService.columnsLabels;
  }

  handleAutoRefreshStart(): void {
    if(this.intervalValue === 0) {
      this.stopInterval.next();
    } else {
      this.interval.next(this.intervalValue);
    }
  }

  autoRefreshTooltip(): string {
    return this.#autoRefreshService.autoRefreshTooltip(this.intervalValue);
  }

  getPageIcon(name: Page): string {
    return this.#iconsService.getPageIcon(name);
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  manageViewInLogs(): void {
    const dialogRef = this.#dialog.open<ManageViewInLogsDialogComponent, ManageViewInLogsDialogData, ManageViewInLogsDialogResult>(ManageViewInLogsDialogComponent, {
      data: {
        serviceIcon: this.serviceIcon,
        serviceName: this.serviceName,
        urlTemplate: this.urlTemplate,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.serviceIcon = result.serviceIcon;
      this.serviceName = result.serviceName;
      this.urlTemplate = result.urlTemplate;

      this.#tasksIndexService.saveViewInLogs(this.serviceIcon, this.serviceName, this.urlTemplate);
    });
  }

  idAssignment(taskId: string) {
    this.taskId = taskId;
  }

  onOptionsChange() {
    this.optionsChange.next();
  }
}
