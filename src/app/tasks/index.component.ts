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
import { BehaviorSubject, Observable, Subject, Subscription, merge, } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableColumn } from '@app/types/column.type';
import { CustomColumn } from '@app/types/data';
import { ManageViewInLogsDialogData, ManageViewInLogsDialogResult } from '@app/types/dialog';
import { Page } from '@app/types/pages';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { ManageCustomColumnDialogComponent } from '@components/manage-custom-dialog.component';
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
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryFilter, TaskSummaryFilters, TaskSummaryListOptions } from './types';

@Component({
  selector: 'app-tasks-index',
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

  displayedColumns: TableColumn<TaskSummaryColumnKey>[] = [];
  displayedColumnsKeys: TaskSummaryColumnKey[] = [];
  customColumns: CustomColumn[];
  availableColumns: TaskSummaryColumnKey[] = [];
  lockColumns: boolean = false;
  columnsLabels: Record<TaskSummaryColumnKey, string> = {} as unknown as Record<TaskSummaryColumnKey, string>;

  selection = new SelectionModel<string>(true, []);
  selectedRows: string[] = [];

  isLoading = true;
  isLoading$: Subject<boolean> = new BehaviorSubject(true);

  taskId: string;

  options: TaskSummaryListOptions;

  filters: TaskSummaryFilters = [];

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
  refresh$: Subject<void> = new Subject<void>();

  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.displayedColumnsKeys = this.#tasksIndexService.restoreColumns();
    this.availableColumns = this.#tasksIndexService.availableTableColumns.map(column => column.key);
    this.customColumns = this.#tasksIndexService.restoreCustomColumns();
    this.availableColumns.push(...this.customColumns);
    this.lockColumns = this.#tasksIndexService.restoreLockColumns();
    this.#tasksIndexService.availableTableColumns.forEach(column => {
      this.columnsLabels[column.key] = column.name;
    });
    this.updateDisplayedColumns();

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
    const mergeSubscription = merge(this.optionsChange, this.refresh, this.interval$).subscribe(() => this.refresh$.next());
    const loadingSubscription = this.isLoading$.subscribe(isLoading => this.isLoading = isLoading);
    this.subscriptions.add(mergeSubscription);
    this.subscriptions.add(loadingSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.displayedColumnsKeys.map(key => {
      if (key.includes('custom.')) {
        const customColumn = key.replaceAll('custom.', '');
        return {
          key: `options.options.${customColumn}`,
          name: customColumn,
          sortable: true,
        };
      } else {
        return this.#tasksIndexService.availableTableColumns.find(column => column.key === key) as TableColumn<TaskSummaryColumnKey>;
      }
    });
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
    if (columns.includes('select')) {
      const selectIndex = columns.indexOf('select');
      columns.splice(selectIndex, 1);
      columns.unshift('select');
    }
    this.displayedColumnsKeys = [...columns];
    this.updateDisplayedColumns();
    this.#tasksIndexService.saveColumns(columns);
  }

  onColumnsReset() {
    this.displayedColumnsKeys = this.#tasksIndexService.resetColumns();
    this.updateDisplayedColumns();
  }

  onFiltersChange(value: unknown[]) {
    this.filters = value as TaskSummaryFilters;

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
    const tasksIds = this.selection.selected;
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

  addCustomColumn(): void {
    const dialogRef = this.#dialog.open<ManageCustomColumnDialogComponent, CustomColumn[], CustomColumn[]>(ManageCustomColumnDialogComponent, {
      data: this.customColumns
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.customColumns = result;
        this.availableColumns = this.availableColumns.filter(column => !column.startsWith('custom.'));
        this.availableColumns.push(...result);
        this.displayedColumnsKeys = this.displayedColumnsKeys.filter(column => !column.startsWith('custom.'));
        this.displayedColumnsKeys.push(...result);
        this.updateDisplayedColumns();
        this.#tasksIndexService.saveColumns(this.displayedColumnsKeys);
        this.#tasksIndexService.saveCustomColumns(this.customColumns);
      }
    });
  }

  idAssignment(taskId: string) {
    this.taskId = taskId;
  }

  onOptionsChange() {
    this.optionsChange.next();
  }
}
