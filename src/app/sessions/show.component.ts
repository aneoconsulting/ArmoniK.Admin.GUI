import { FilterStringOperator, PartitionRawEnumField, ResultRawEnumField, SessionStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, catchError, map, switchMap } from 'rxjs';
import { AppShowComponent, ShowActionButton, ShowActionInterface, ShowCancellableInterface } from '@app/types/components/show';
import { ShowPageComponent } from '@components/show-page.component';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { SessionsFiltersService } from './services/sessions-filters.service';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRaw } from './types';

@Component({
  selector: 'app-sessions-show',
  template: `
<app-show-page [id]="data?.sessionId ?? ''" [data]="data" [sharableURL]="sharableURL" [statuses]="statuses" [actionsButton]="actionButtons" (refresh)="onRefresh()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('sessions')"></mat-icon>
  <span i18n="Page title"> Session </span>
</app-show-page>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
    UtilsService,
    ShareUrlService,
    QueryParamsService,
    SessionsGrpcService,
    SessionsStatusesService,
    SessionsIndexService,
    SessionsFiltersService,
    TableService,
    TableURLService,
    TableStorageService,
    NotificationService,
    MatSnackBar,
    FiltersService
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent extends AppShowComponent<SessionRaw, SessionsGrpcService> implements OnInit, AfterViewInit, ShowActionInterface, ShowCancellableInterface {
  cancel$ = new Subject<void>();

  private _sessionsStatusesService = inject(SessionsStatusesService);
  protected override _grpcService = inject(SessionsGrpcService);
  private _filtersService = inject(FiltersService);

  actionButtons: ShowActionButton[] = [
    {
      id: 'tasks',
      name: $localize`See tasks`,
      icon: this.getPageIcon('tasks'),
      link: '/tasks',
      queryParams: {},
    },
    {
      id: 'results',
      name: $localize`See results`,
      icon: this.getPageIcon('results'),
      link: '/results',
      queryParams: {},
    },
    {
      id: 'partitions',
      name: $localize`See partitions`,
      icon: this.getPageIcon('partitions'),
      link: '/partitions',
      queryParams: {},
    },
    {
      id: 'cancel',
      name: $localize`Cancel Session`,
      icon: this.getIcon('cancel'),
      action$: this.cancel$,
      disabled: this.canCancel(),
      color: 'accent',
      area: 'right'
    }
  ];

  ngOnInit(): void {
    this.sharableURL = this.getSharableUrl();
  }

  ngAfterViewInit(): void {
    this.refresh.pipe(
      switchMap(() => {
        return this._grpcService.get$(this.id);
      }),
      map((data) => {
        return data.session ?? null;
      }),
      catchError(error => this.handleError(error))
    ).subscribe((data) => {
      if (data) {
        this.data = data;
        this.setPartitionQueryParams();
        this.setQueryParams('results', this.resultsKey);
        this.setQueryParams('tasks', this.tasksKey);
      }
    });

    this.getIdByRoute();
    this.cancel$.subscribe(() => {
      this.cancel();
    });
  }

  get statuses() {
    return this._sessionsStatusesService.statuses;
  }

  cancel(): void {
    if(!this.data?.sessionId) {
      return;
    }

    this._grpcService.cancel$(this.data.sessionId).subscribe({
      complete: () => {
        this.success('Session canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this.error('Unable to cancel session');
      },
    });
  }

  get resultsKey() {
    return this._filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
  }

  get tasksKey() {
    return this._filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
  }

  setPartitionQueryParams() {
    if (this.data) {
      const action = this.actionButtons.find(element => element.id === 'partitions');
      if (action) {
        const params: {[key: string]: string} = {};
        this.data.partitionIds.forEach((partitionId, index) => {
          const keyPartition = this._filtersService.createQueryParamsKey<PartitionRawEnumField>(index, 'root' , FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID);
          params[keyPartition] = partitionId;
        });
        action.queryParams = params;
      }
    }
  }

  setQueryParams(actionId: string, key: string) {
    if(this.data) {
      const action = this.actionButtons.find(element => element.id === actionId);
      if (action) {
        const params: {[key: string]: string} = {};
        params[key] = this.data.sessionId;
        action.queryParams = params;
      }
    }
  }

  canCancel(): boolean {
    return this._sessionsStatusesService.sessionNotEnded(this.data?.status ?? SessionStatus.SESSION_STATUS_UNSPECIFIED);
  }
}
