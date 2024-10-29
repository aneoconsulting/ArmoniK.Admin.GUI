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
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TaskOptions, TaskSummary } from '@app/tasks/types';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { DashboardLineCustomColumnsComponent } from '@app/types/components/dashboard-line-table';
import { ManageViewInLogsDialogData, ManageViewInLogsDialogResult } from '@app/types/dialog';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard-tasks-line',
  templateUrl: './tasks-line.component.html',
  standalone: true,
  providers: [
    MatSnackBar,
    TasksIndexService,
    NotificationService,
    TasksFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: TasksFiltersService
    },
    TasksGrpcService,
    GrpcSortFieldService,
    TasksDataService,
    FiltersService,
  ],
  imports: [
    MatToolbarModule,
    TableDashboardActionsToolbarComponent,
    FiltersToolbarComponent,
    TasksTableComponent,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ]
})
export class TasksLineComponent extends DashboardLineCustomColumnsComponent<TaskSummary, TaskSummaryEnumField, TaskOptions, TaskOptionEnumField> implements OnInit, AfterViewInit, OnDestroy {
  readonly indexService = inject(TasksIndexService);
  readonly tableDataService = inject(TasksDataService);

  serviceIcon: string | null = null;
  serviceName: string | null = null;
  urlTemplate: string | null = null;

  selection: string[] = [];
  readonly defaultConfig = this.defaultConfigService.defaultTasks;

  ngOnInit(): void {
    this.initLineEnvironment();

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

  onSelectionChange(selection: string[]): void {
    this.selection = selection;
  }

  onCancelTasksSelection():void {
    this.cancelTasks(this.selection);
  }

  cancelTasks(tasksIds: string[]): void {
    this.tableDataService.cancelTasks(tasksIds);
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