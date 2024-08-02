import { GetResultResponse } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AppShowComponent } from '@app/types/components/show';
import { ShowPageComponent } from '@components/show-page.component';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { ResultsFiltersService } from './services/results-filters.service';
import { ResultsGrpcService } from './services/results-grpc.service';
import { ResultsInspectionService } from './services/results-inspection.service';
import { ResultsStatusesService } from './services/results-statuses.service';
import { ResultRaw } from './types';

@Component({
  selector: 'app-result-show',
  template: `
<app-show-page [id]="id" [data]="data()" [status]="status" [fields]="fields" [sharableURL]="sharableURL" [statuses]="statuses" (refresh)="onRefresh()">
  <div class="title" title>
    <mat-icon aria-hidden="true" [fontIcon]="getIcon('results')"></mat-icon>
    <span i18n="Page title"> Result </span>
  </div>
  <div class="actions" actions>
  <button mat-button [routerLink]="'/sessions/' + data()?.sessionId">
    <mat-icon [fontIcon]="getIcon('sessions')"/>
    <span i18n>See Session</span>
  </button>
  <button mat-button [routerLink]="'/tasks/' + data()?.ownerTaskId">
    <mat-icon [fontIcon]="getIcon('tasks')"/>
    <span i18n>See Owner Task</span>
  </button>
  </div>
</app-show-page>
  `,
  styleUrl: '../../inspections.css',
  standalone: true,
  providers: [
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    ResultsGrpcService,
    ResultsStatusesService,
    TableService,
    TableStorageService,
    TableURLService,
    ResultsFiltersService,
    NotificationService,
    MatSnackBar,
    ResultsInspectionService,
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowComponent extends AppShowComponent<ResultRaw, GetResultResponse> implements OnInit, OnDestroy {
  readonly grpcService = inject(ResultsGrpcService);
  readonly inspectionService = inject(ResultsInspectionService);

  private readonly resultsStatusesService = inject(ResultsStatusesService);

  get status() {
    const data: ResultRaw | null = this.data();
    if (data) {
      return this.statuses[data.status];
    }
    return undefined;
  }

  ngOnInit(): void {
    this.initInspection();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }

  getDataFromResponse(data: GetResultResponse): ResultRaw | undefined {
    return data.result;
  }

  afterDataFetching(): void { }

  get statuses() {
    return this.resultsStatusesService.statuses;
  }
}
