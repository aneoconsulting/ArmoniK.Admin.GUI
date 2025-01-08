import { SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { DashboardStorageService } from '@app/dashboard/services/dashboard-storage.service';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskOptions } from '@app/tasks/types';
import { TableHandlerCustomValues } from '@app/types/components';
import { ColumnKey } from '@app/types/data';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { TableType } from '@app/types/table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableIndexActionsToolbarComponent } from '@components/table-index-actions-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { SessionsTableComponent } from './components/table.component';
import { SessionsDataService } from './services/sessions-data.service';
import { SessionsFiltersService } from './services/sessions-filters.service';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRaw } from './types';

@Component({
  selector: 'app-sessions-index',
  templateUrl: './index.component.html',
  standalone: true,
  providers: [
    ShareUrlService,
    QueryParamsService,
    StorageService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    SessionsIndexService,
    TasksStatusesService,
    TasksIndexService,
    FiltersService,
    TasksFiltersService,
    SessionsFiltersService,
    {
      provide: DataFilterService,
      useExisting: SessionsFiltersService
    },
    SessionsStatusesService,
    MatDialog,
    DashboardIndexService,
    DashboardStorageService,
    SessionsDataService,
    SessionsGrpcService,
    NotificationService,
    TasksGrpcService,
    GrpcSortFieldService,
  ],
  imports: [
    PageHeaderComponent,
    MatSnackBarModule,
    TableIndexActionsToolbarComponent,
    FiltersToolbarComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    SessionsTableComponent
  ]
})
export class IndexComponent extends TableHandlerCustomValues<SessionRaw, SessionRawEnumField, TaskOptions, TaskOptionEnumField> implements OnInit, AfterViewInit, OnDestroy {
  readonly filtersService = inject(SessionsFiltersService);
  readonly indexService = inject(SessionsIndexService);
  readonly tableDataService = inject(SessionsDataService);

  tableType: TableType = 'Sessions';

  ngOnInit() {
    this.initTableEnvironment();
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  checkIfDurationDisplayed() {
    this.tableDataService.isDurationDisplayed = this.displayedColumnsKeys.includes('duration');
  }

  override refresh() {
    this.checkIfDurationDisplayed();
    super.refresh();
  }

  override onColumnsChange(columns: ColumnKey<SessionRaw, TaskOptions>[]): void {
    super.onColumnsChange(columns);
    if (this.displayedColumnsKeys.includes('duration')) {
      this.refresh();
    }
  }
}
