import { TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ManageViewInLogsDialogComponent } from '@app/tasks/components/manage-view-in-logs-dialog.component';
import { TasksTableComponent } from '@app/tasks/components/table.component';
import TasksDataService from '@app/tasks/services/tasks-data.service';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcActionsService } from '@app/tasks/services/tasks-grpc-actions.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskOptions, TaskSummary } from '@app/tasks/types';
import { DashboardLineCustomColumnsComponent } from '@app/types/components/dashboard-line-table';
import { ManageViewInLogsDialogData, ManageViewInLogsDialogResult } from '@app/types/dialog';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableGrpcActionsComponent } from '@components/table/table-grpc-actions.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard-tasks-line',
  templateUrl: './tasks-line.component.html',
  providers: [
    MatSnackBar,
    TasksIndexService,
    NotificationService,
    TasksFiltersService,
    {
      provide: DataFilterService,
      useExisting: TasksFiltersService
    },
    TasksGrpcService,
    GrpcSortFieldService,
    TasksDataService,
    FiltersService,
    {
      provide: StatusService,
      useClass: TasksStatusesService,
    },
    {
      provide: GrpcActionsService,
      useClass: TasksGrpcActionsService,
    },
  ],
  imports: [
    MatToolbarModule,
    TableDashboardActionsToolbarComponent,
    FiltersToolbarComponent,
    TasksTableComponent,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    TableGrpcActionsComponent
  ]
})
export class TasksLineComponent extends DashboardLineCustomColumnsComponent<TaskSummary, TaskSummaryEnumField, TaskOptions, TaskOptionEnumField> implements OnInit, AfterViewInit, OnDestroy {
  readonly indexService = inject(TasksIndexService);
  readonly tableDataService = inject(TasksDataService);
  readonly grpcActionsService = inject(GrpcActionsService);

  serviceIcon: string | null = null;
  serviceName: string | null = null;
  urlTemplate: string | null = null;

  selection: TaskSummary[] = [];
  readonly defaultConfig = this.defaultConfigService.defaultTasks;

  ngOnInit(): void {
    this.initLineEnvironment();

    this.grpcActionsService.refresh = this.tableDataService.refresh$;
    const viewInLogs = this.indexService.restoreViewInLogs();
    this.serviceIcon = viewInLogs.serviceIcon;
    this.serviceName = viewInLogs.serviceName;
    this.urlTemplate = viewInLogs.urlTemplate;
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
    this.handleAutoRefreshStart();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  onSelectionChange(selection: TaskSummary[]): void {
    this.selection = selection;
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
      if (result) {
        this.serviceIcon = result.serviceIcon;
        this.serviceName = result.serviceName;
        this.urlTemplate = result.urlTemplate;
  
        this.indexService.saveViewInLogs(this.serviceIcon, this.serviceName, this.urlTemplate);
      }
    });
  }
}