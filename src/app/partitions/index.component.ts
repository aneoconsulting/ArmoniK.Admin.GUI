import { PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { DashboardStorageService } from '@app/dashboard/services/dashboard-storage.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableHandler } from '@app/types/components';
import { TableType } from '@app/types/table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableIndexActionsToolbarComponent } from '@components/table-index-actions-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { UtilsService } from '@services/utils.service';
import { PartitionsTableComponent } from './components/table.component';
import { PartitionsFiltersService } from './services/partitions-filters.service';
import { PartitionsGrpcService } from './services/partitions-grpc.service';
import { PartitionsIndexService } from './services/partitions-index.service';
import { PartitionRaw } from './types';

@Component({
  selector: 'app-partitions-index',
  templateUrl: './index.component.html',
  standalone: true,
  providers: [
    ShareUrlService,
    QueryParamsService,
    TableURLService,
    TableStorageService,
    TableService,
    UtilsService,
    AutoRefreshService,
    PartitionsIndexService,
    PartitionsGrpcService,
    NotificationService,
    TasksByStatusService,
    TasksStatusesService,
    TasksIndexService,
    FiltersService,
    PartitionsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: PartitionsFiltersService
    },
    DashboardIndexService,
    DashboardStorageService,
  ],
  imports: [
    PageHeaderComponent,
    TableIndexActionsToolbarComponent,
    FiltersToolbarComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    PartitionsTableComponent
  ]
})
export class IndexComponent extends TableHandler<PartitionRaw, PartitionRawEnumField> implements OnInit, AfterViewInit, OnDestroy {

  readonly filtersService = inject(PartitionsFiltersService);
  readonly indexService = inject(PartitionsIndexService);

  tableType: TableType = 'Partitions';

  ngOnInit() {
    this.initTableEnvironment();
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
