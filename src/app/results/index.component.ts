import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoWrapDirective } from '@app/directives/no-wrap.directive';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableHandler } from '@app/types/components';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { PageHeaderComponent } from '@components/page-header.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
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
import { ResultRawColumnKey, ResultRawFilters, ResultRawListOptions } from './types';


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
  ],
  imports: [
    NoWrapDirective,
    EmptyCellPipe,
    NgIf,
    NgFor,
    DatePipe,
    PageHeaderComponent,
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatMenuModule,
    TableEmptyDataComponent,
    ResultsTableComponent
  ]
})
export class IndexComponent extends TableHandler<ResultRawColumnKey, ResultRawListOptions, ResultRawFilters, ResultRawEnumField> implements OnInit, AfterViewInit, OnDestroy {

  readonly filtersService = inject(ResultsFiltersService);
  readonly indexService = inject(ResultsIndexService);

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
