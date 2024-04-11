import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SessionsTableComponent } from '@app/sessions/components/table.component';
import { SessionsFiltersService } from '@app/sessions/services/sessions-filters.service';
import { SessionsIndexService } from '@app/sessions/services/sessions-index.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { SessionRawColumnKey, SessionRawFilters, SessionRawListOptions } from '@app/sessions/types';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard-sessions-line',
  templateUrl: './sessions-line.component.html',
  standalone: true,
  providers: [
    MatSnackBar,
    NotificationService,
    SessionsFiltersService,
    SessionsIndexService,
    SessionsStatusesService,
    TasksStatusesService,
    TasksFiltersService,
  ],
  imports: [
    MatToolbarModule,
    TableDashboardActionsToolbarComponent,
    FiltersToolbarComponent,
    SessionsTableComponent,
    MatIconModule,
    MatMenuModule,
  ],
})
export class SessionsLineComponent extends DashboardLineTableComponent<SessionRawColumnKey, SessionRawListOptions, SessionRawFilters> implements OnInit, AfterViewInit, OnDestroy {
  readonly indexService = inject(SessionsIndexService);

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