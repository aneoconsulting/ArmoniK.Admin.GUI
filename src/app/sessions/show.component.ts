import { FilterStringOperator, ResultRawEnumField, SessionStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, catchError, map, switchMap } from 'rxjs';
import { AppShowComponent, ShowActionButton, ShowActionInterface, ShowCancellableInterface, ShowClosableInterface } from '@app/types/components/show';
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
export class ShowComponent extends AppShowComponent<SessionRaw, SessionsGrpcService> implements OnInit, AfterViewInit, ShowActionInterface, ShowCancellableInterface, ShowClosableInterface {
  cancel$ = new Subject<void>();
  close$ = new Subject<void>();

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
    },
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
        this._filtersService.createFilterPartitionQueryParams(this.actionButtons, this.data.partitionIds);
        this._filtersService.createFilterQueryParams(this.actionButtons, 'results', this.resultsKey, this.data.sessionId);
        this._filtersService.createFilterQueryParams(this.actionButtons, 'tasks', this.tasksKey, this.data.sessionId);
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

  close(): void {
    if(!this.data?.sessionId) {
      return;
    }

    this._grpcService.close$(this.data.sessionId).subscribe({
      complete: () => {
        this.success('Session closed');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this.error('Unable to close session');
      },
    });
  }

  get resultsKey() {
    return this._filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
  }

  get tasksKey() {
    return this._filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
  }

  canCancel(): boolean {
    return this._sessionsStatusesService.canCancel(this.data?.status ?? SessionStatus.SESSION_STATUS_UNSPECIFIED);
  }

  canClose(): boolean {
    return this._sessionsStatusesService.canClose(this.data?.status ?? SessionStatus.SESSION_STATUS_UNSPECIFIED);
  }
}
