import { ResultRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ResultsTableComponent } from '@app/results/components/table.component';
import ResultsDataService from '@app/results/services/results-data.service';
import { ResultsFiltersService } from '@app/results/services/results-filters.service';
import { ResultsGrpcActionsService } from '@app/results/services/results-grpc-actions.service';
import { ResultsGrpcService } from '@app/results/services/results-grpc.service';
import { ResultsIndexService } from '@app/results/services/results-index.service';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { ResultRaw } from '@app/results/types';
import { DashboardLineTableComponent } from '@app/types/components/dashboard-line-table';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableGrpcActionsComponent } from '@components/table/table-grpc-actions.component';
import { TableDashboardActionsToolbarComponent } from '@components/table-dashboard-actions-toolbar.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-dashboard-results-line',
  templateUrl: './results-line.component.html',
  providers: [
    MatSnackBar,
    ResultsIndexService,
    ResultsFiltersService,
    {
      provide: DataFilterService,
      useExisting: ResultsFiltersService
    },
    ResultsDataService,
    ResultsGrpcService,
    {
      provide: StatusService,
      useClass: ResultsStatusesService,
    },
    GrpcSortFieldService,
    FiltersService,
    NotificationService,
    {
      provide: GrpcActionsService,
      useClass: ResultsGrpcActionsService,
    },
  ],
  imports: [
    MatIconModule,
    MatToolbarModule,
    TableDashboardActionsToolbarComponent,
    FiltersToolbarComponent,
    ResultsTableComponent,
    MatMenuModule,
    TableGrpcActionsComponent
  ]
})
export class ResultsLineComponent extends DashboardLineTableComponent<ResultRaw, ResultRawEnumField> implements OnInit, OnDestroy, AfterViewInit {
  readonly indexService = inject(ResultsIndexService);
  readonly defaultConfig = this.defaultConfigService.defaultResults;
  readonly tableDataService = inject(ResultsDataService);

  selection: ResultRaw[] = [];

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

  onSelectionChange(selection: ResultRaw[]): void {
    this.selection = selection;
  }

  hasSelectColumnDisplayed() {
    return this.displayedColumnsKeys.includes('select');
  }
}