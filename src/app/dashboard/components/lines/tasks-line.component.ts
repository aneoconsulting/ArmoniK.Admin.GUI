import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TasksTableComponent } from '@app/tasks/components/table.component';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TaskSummaryColumnKey, TaskSummaryFilters, TaskSummaryListOptions } from '@app/tasks/types';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
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
  ],
  imports: [
    MatToolbarModule,
    TableDashboardActionsToolbarComponent,
    FiltersToolbarComponent,
    TasksTableComponent,
    MatIconModule,
    MatMenuModule,
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