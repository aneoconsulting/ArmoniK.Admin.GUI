import { FilterStringOperator, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableHandlerCustomValues } from '@app/types/components';
import { ManageViewInLogsDialogData, ManageViewInLogsDialogResult } from '@app/types/dialog';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
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
export class IndexComponent extends TableHandlerCustomValues<TaskSummaryColumnKey, TaskSummaryListOptions, TaskSummaryFilters, TaskSummaryEnumField> implements OnInit, AfterViewInit, OnDestroy {
  readonly tasksGrpcService = inject(TasksGrpcService);
  readonly notificationService = inject(NotificationService);
  readonly indexService = inject(TasksIndexService);
  readonly filtersService = inject(TasksFiltersService);

  selection: string[] = [];

  serviceIcon: string | null = null;
  serviceName: string | null = null;
  urlTemplate: string | null = null;

  ngOnInit(): void {
    this.initTableEnvironment();

    const viewInLogs = this.indexService.restoreViewInLogs();
    this.serviceIcon = viewInLogs.serviceIcon;
    this.serviceName = viewInLogs.serviceName;
    this.urlTemplate = viewInLogs.urlTemplate;
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
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

  onSelectionChange(selection: string[]): void {
    this.selection = selection;
  }

  onCancelTasksSelection():void {
    this.cancelTasks(this.selection);
  }

  cancelTasks(tasksIds: string[]): void {
    this.tasksGrpcService.cancel$(tasksIds).subscribe({
      complete: () => {
        this.notificationService.success('Tasks canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this.notificationService.error('Unable to cancel tasks');
      },
    });
  }

  manageViewInLogs(): void {
    const dialogRef = this.dialog.open<ManageViewInLogsDialogComponent, ManageViewInLogsDialogData, ManageViewInLogsDialogResult>(ManageViewInLogsDialogComponent, {
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
}
