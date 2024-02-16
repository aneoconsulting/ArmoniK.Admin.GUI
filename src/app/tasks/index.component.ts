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
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { AbstractIndexComponent } from '@app/types/components';
import { GenericColumn } from '@app/types/data';
import { ManageViewInLogsDialogData, ManageViewInLogsDialogResult } from '@app/types/dialog';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { ManageGenericColumnDialogComponent } from '@components/manage-generic-dialog.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
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
export class IndexComponent extends AbstractIndexComponent<TaskSummaryColumnKey, TaskSummaryListOptions, TaskSummaryFiltersOr, TaskSummary> implements OnInit, AfterViewInit, OnDestroy {
  readonly #dialog = inject(MatDialog);
  protected override indexService = inject(TasksIndexService);
  protected override grpcService = inject(TasksGrpcService);
  protected override filterService = inject(TasksFiltersService);

  selection = new SelectionModel<string>(true, []);
  selectedRows: string[] = [];

  taskId: string;

  genericColumns: GenericColumn[];

  serviceIcon: string | null = null;
  serviceName: string | null = null;
  urlTemplate: string | null = null;

  ngOnInit(): void {

    this.restore();

    // interface Generics
    this.genericColumns = this.indexService.restoreGenericColumns();
    this.availableColumns.push(...this.genericColumns);

    // Interface ViewInLogs
    const viewInLogs = this.indexService.restoreViewInLogs();
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
          this.selectedRows = this.selection.selected;
          this.selection.clear();

          this.sharableURL = this.generateUrl();
          this.saveOptions();

          return this.grpcService.list$(this.options, this.filters).pipe(
            catchError((error) => {
              console.error(error);
              this.error('Unable to fetch tasks');
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
            this.selection.select(...this.data.map(task => task.id));
          } else {
            this.selection.select(...(this.data.filter(task => this.selectedRows.includes(task.id))).map(task => task.id));
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

    this.onFiltersChange([[filter]]);
  }

  onCancelTask(taskId: string): void {
    this.cancelTasks([taskId]);
  }

  onCancelTasksSelection():void {
    const tasksIds = this.selection.selected;
    this.cancelTasks(tasksIds);
  }

  cancelTasks(tasksIds: string[]): void {
    this.grpcService.cancel$(tasksIds).subscribe({
      complete: () => {
        this.success('Tasks canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this.error('Unable to cancel tasks');
      },
    });
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

      this.indexService.saveViewInLogs(this.serviceIcon, this.serviceName, this.urlTemplate);
    });
  }

  addGenericColumn(): void {
    const dialogRef = this.#dialog.open<ManageGenericColumnDialogComponent, GenericColumn[], GenericColumn[]>(ManageGenericColumnDialogComponent, {
      data: this.genericColumns
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.genericColumns = result;
        this.availableColumns = this.availableColumns.filter(column => !column.startsWith('generic.'));
        this.availableColumns.push(...result);
        this.displayedColumns = this.displayedColumns.filter(column => !column.startsWith('generic.'));
        this.displayedColumns.push(...result);
        this.indexService.saveColumns(this.displayedColumns);
        this.indexService.saveGenericColumns(this.genericColumns);
      }
    });
  }

  idAssignment(taskId: string) {
    this.taskId = taskId;
  }
}
