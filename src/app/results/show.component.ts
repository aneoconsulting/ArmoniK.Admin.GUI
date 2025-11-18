import { GetResultResponse, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AppShowComponent } from '@app/types/components/show';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusLabelColor, StatusService } from '@app/types/status';
import { ShowPageComponent } from '@components/show-page.component';
import { DefaultConfigService } from '@services/default-config.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { StorageService } from '@services/storage.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcActionsService } from './services/results-grpc-actions.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsInspectionService } from './services/results-inspection.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw } from './types';

@Component({
  selector: 'app-result-show',
  templateUrl: 'show.component.html',
  styleUrls: ['../../inspections.scss'],
  standalone: true,
  providers: [
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    ResultsGrpcService,
    TableService,
    TableStorageService,
    TableURLService,
    ResultsFiltersService,
    NotificationService,
    MatSnackBar,
    ResultsInspectionService,
    DefaultConfigService,
    StorageService,
    {
      provide: StatusService,
      useClass: ResultsStatusesService,
    },
    {
      provide: GrpcActionsService,
      useClass: ResultsGrpcActionsService,
    }
  ],
  imports: [ShowPageComponent, MatIconModule, MatButtonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowComponent
  extends AppShowComponent<ResultRaw, GetResultResponse>
  implements OnInit, OnDestroy
{
  readonly resultsNotificationService = inject(NotificationService);
  readonly grpcService = inject(ResultsGrpcService);
  readonly inspectionService = inject(ResultsInspectionService);
  readonly grpcActionsService = inject(GrpcActionsService);

  private readonly resultsStatusesService = inject(StatusService) as ResultsStatusesService;

  result: ResultRaw;
  private _status: StatusLabelColor | undefined;

  set status(status: ResultStatus | undefined) {
    this._status = status ? this.statuses[status] : undefined;
  }

  get status(): StatusLabelColor | undefined {
    return this._status;
  }

  get statuses() {
    return this.resultsStatusesService.statuses;
  }

  ngOnInit(): void {
    this.initInspection();
    this.grpcActionsService.refresh = this.refresh;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getDataFromResponse(data: GetResultResponse): ResultRaw | undefined {
    return data.result;
  }
 
  afterDataFetching(): void {
    const data = this.data();
    if (data) {
      this.result = data;
      this.status = this.data()?.status;
    }
  }
}