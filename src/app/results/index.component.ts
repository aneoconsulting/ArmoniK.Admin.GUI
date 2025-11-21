import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { DashboardStorageService } from '@app/dashboard/services/dashboard-storage.service';
import { TableHandler } from '@app/types/components';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { TableType } from '@app/types/table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableGrpcActionsComponent } from '@components/table/table-grpc-actions.component';
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
import { ResultsTableComponent } from './components/table.component';
import ResultsDataService from './services/results-data.service';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcActionsService } from './services/results-grpc-actions.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsIndexService } from './services/results-index.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw } from './types';

@Component({
  selector: 'app-results-index',
  templateUrl: './index.component.html',
  providers: [
    ShareUrlService,
    QueryParamsService,
    StorageService,
    UtilsService,
    TableURLService,
    TableService,
    ResultsIndexService,
    AutoRefreshService,
    ResultsFiltersService,
    {
      provide: DataFilterService,
      useExisting: ResultsFiltersService,
    },
    {
      provide: StatusService,
      useClass: ResultsStatusesService
    },
    TableStorageService,
    NotificationService,
    DashboardIndexService,
    DashboardStorageService,
    ResultsDataService,
    ResultsGrpcService,
    GrpcSortFieldService,
    FiltersService,
    {
      provide: GrpcActionsService,
      useClass: ResultsGrpcActionsService,
    }
  ],
  imports: [
    PageHeaderComponent,
    TableIndexActionsToolbarComponent,
    FiltersToolbarComponent,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    ResultsTableComponent,
    TableGrpcActionsComponent
  ]
})
export class IndexComponent extends TableHandler<ResultRaw, ResultRawEnumField> implements OnInit, AfterViewInit, OnDestroy {
  readonly tableDataService = inject(ResultsDataService);
  readonly filtersService = inject(ResultsFiltersService);
  readonly indexService = inject(ResultsIndexService);
  readonly grpcActionsService = inject(GrpcActionsService);

  tableType: TableType = 'Results';

  selection: ResultRaw[] = [];

  ngOnInit(): void {
    this.initTableEnvironment();
    this.grpcActionsService.refresh = this.tableDataService.refresh$;
  }

  ngAfterViewInit(): void {
    this.mergeSubscriptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  onSelectionChange(selection: ResultRaw[]): void {
    this.selection = selection;
  }

  hasSelectColumnDisplayed() {
    return this.displayedColumnsKeys.includes('select');
  }
}
