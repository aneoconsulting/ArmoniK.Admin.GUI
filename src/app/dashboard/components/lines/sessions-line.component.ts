import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SessionsTableComponent } from '@app/sessions/components/table.component';
import { SessionsFiltersService } from '@app/sessions/services/sessions-filters.service';
import { SessionsIndexService } from '@app/sessions/services/sessions-index.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { SessionRawColumnKey, SessionRawFilters, SessionRawListOptions } from '@app/sessions/types';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard-sessions-line',
  templateUrl: './sessions-line.component.html',
  standalone: true,
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
  providers: [
    MatSnackBar,
    NotificationService,
    SessionsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: SessionsFiltersService
    },
    SessionsIndexService,
    SessionsStatusesService,
    TasksStatusesService,
    TasksFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: TasksFiltersService
    },
  ],
  imports: [
    MatToolbarModule,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    SessionsTableComponent,
    MatIconModule,
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