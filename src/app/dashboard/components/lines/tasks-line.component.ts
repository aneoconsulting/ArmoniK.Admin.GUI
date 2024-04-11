import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TasksTableComponent } from '@app/tasks/components/table.component';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TaskSummaryColumnKey, TaskSummaryFilters, TaskSummaryListOptions } from '@app/tasks/types';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
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
    }
  ],
  imports: [
    MatToolbarModule,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TasksTableComponent,
    MatIconModule,
  ]
})
export class TasksLineComponent extends DashboardLineTableComponent<TaskSummaryColumnKey, TaskSummaryListOptions, TaskSummaryFilters> implements OnInit, AfterViewInit, OnDestroy {
  readonly indexService = inject(TasksIndexService);

  ngOnInit(): void {
    this.initLineEnvironment();
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}