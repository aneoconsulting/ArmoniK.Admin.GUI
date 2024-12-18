import { SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SessionsTableComponent } from '@app/sessions/components/table.component';
import { SessionsDataService } from '@app/sessions/services/sessions-data.service';
import { SessionsFiltersService } from '@app/sessions/services/sessions-filters.service';
import { SessionsGrpcService } from '@app/sessions/services/sessions-grpc.service';
import { SessionsIndexService } from '@app/sessions/services/sessions-index.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { SessionRaw } from '@app/sessions/types';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskOptions } from '@app/tasks/types';
import { DashboardLineCustomColumnsComponent } from '@app/types/components/dashboard-line-table';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard-sessions-line',
  templateUrl: './sessions-line.component.html',
  standalone: true,
  providers: [
    MatSnackBar,
    NotificationService,
    SessionsFiltersService,
    {
      provide: DataFilterService,
      useExisting: SessionsFiltersService
    },
    SessionsIndexService,
    SessionsStatusesService,
    TasksStatusesService,
    TasksFiltersService,
    SessionsGrpcService,
    SessionsDataService,
    GrpcSortFieldService,
    FiltersService,
    TasksGrpcService,
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
export class SessionsLineComponent extends DashboardLineCustomColumnsComponent<SessionRaw, SessionRawEnumField, TaskOptions, TaskOptionEnumField> implements OnInit, AfterViewInit, OnDestroy {
  readonly indexService = inject(SessionsIndexService);
  readonly defaultConfig = this.defaultConfigService.defaultSessions;
  readonly tableDataService = inject(SessionsDataService);

  ngOnInit(): void {
    this.initLineEnvironment();
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
    this.handleAutoRefreshStart();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}