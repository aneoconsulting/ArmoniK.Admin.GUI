import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { DashboardStorageService } from '@app/dashboard/services/dashboard-storage.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableHandler } from '@app/types/components';
import { TableType } from '@app/types/table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableIndexActionsToolbarComponent } from '@components/table-index-actions-toolbar.component';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ResultsTableComponent } from './components/table.component';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsIndexService } from './services/results-index.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw } from './types';


@Component({
  selector: 'app-results-index',
  templateUrl: './index.component.html',
  standalone: true,
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
      provide: DATA_FILTERS_SERVICE,
      useExisting: ResultsFiltersService,
    },
    ResultsStatusesService,
    TableStorageService,
    NotificationService,
    DashboardIndexService,
    DashboardStorageService,
    TasksStatusesService,
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
    ResultsTableComponent
  ]
})
export class IndexComponent extends TableHandler<ResultRaw, ResultRawEnumField> implements OnInit, AfterViewInit, OnDestroy {

  readonly filtersService = inject(ResultsFiltersService);
  readonly indexService = inject(ResultsIndexService);

  tableType: TableType = 'Results';

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
