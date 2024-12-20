import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ResultsTableComponent } from '@app/results/components/table.component';
import ResultsDataService from '@app/results/services/results-data.service';
import { ResultsFiltersService } from '@app/results/services/results-filters.service';
import { ResultsGrpcService } from '@app/results/services/results-grpc.service';
import { ResultsIndexService } from '@app/results/services/results-index.service';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { ResultRaw } from '@app/results/types';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard-results-line',
  templateUrl: './results-line.component.html',
  standalone: true,
  providers: [
    MatSnackBar,
    ResultsIndexService,
    ResultsFiltersService,
    {
      provide: DATA_FILTERS_SERVICE,
      useExisting: ResultsFiltersService
    },
    ResultsDataService,
    ResultsGrpcService,
    ResultsStatusesService,
    GrpcSortFieldService,
    FiltersService,
    NotificationService,
  ],
  imports: [
    MatIconModule,
    MatToolbarModule,
    TableDashboardActionsToolbarComponent,
    FiltersToolbarComponent,
    ResultsTableComponent,
    MatMenuModule,
  ]
})
export class ResultsLineComponent extends DashboardLineTableComponent<ResultRaw, ResultRawEnumField> implements OnInit, OnDestroy, AfterViewInit {
  readonly indexService = inject(ResultsIndexService);
  readonly defaultConfig = this.defaultConfigService.defaultResults;
  readonly tableDataService = inject(ResultsDataService);

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