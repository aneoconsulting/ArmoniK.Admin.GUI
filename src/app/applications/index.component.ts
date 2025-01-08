import { ApplicationRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { DashboardStorageService } from '@app/dashboard/services/dashboard-storage.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TableHandler } from '@app/types/components';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { TableType } from '@app/types/table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableIndexActionsToolbarComponent } from '@components/table-index-actions-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ApplicationsTableComponent } from './components/table.component';
import ApplicationsDataService from './services/applications-data.service';
import { ApplicationsFiltersService } from './services/applications-filters.service';
import { ApplicationsGrpcService } from './services/applications-grpc.service';
import { ApplicationsIndexService } from './services/applications-index.service';
import { ApplicationRaw } from './types';

@Component({
  selector: 'app-applications-index',
  templateUrl: './index.component.html',
  standalone: true,
  providers: [
    IconsService,
    ShareUrlService,
    QueryParamsService,
    TableService,
    TableURLService,
    TableStorageService,
    StorageService,
    UtilsService,
    AutoRefreshService,
    ApplicationsIndexService,
    TasksStatusesService,
    ApplicationsFiltersService,
    {
      provide: DataFilterService,
      useExisting: ApplicationsFiltersService
    },
    DashboardIndexService,
    DashboardStorageService,
    ApplicationsDataService,
    ApplicationsGrpcService,
    CacheService,
    NotificationService,
    FiltersService,
    GrpcSortFieldService,
  ],
  imports: [
    PageHeaderComponent,
    TableIndexActionsToolbarComponent,
    FiltersToolbarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatMenuModule,
    ApplicationsTableComponent
  ]
})
export class IndexComponent extends TableHandler<ApplicationRaw, ApplicationRawEnumField> implements OnInit, AfterViewInit, OnDestroy {
  readonly tableDataService = inject(ApplicationsDataService);
  readonly filtersService = inject(ApplicationsFiltersService);
  readonly indexService = inject(ApplicationsIndexService);

  tableType: TableType = 'Applications';

  ngOnInit(): void {
    this.initTableEnvironment();
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
