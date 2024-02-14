import { FilterStringOperator, PartitionRawEnumField, ResultRawEnumField, SessionStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subject, catchError, map, of, switchMap } from 'rxjs';
import { SessionShowComponent, ShowActionButton, showActionSessionData } from '@app/types/components/show';
import { Page } from '@app/types/pages';
import { ShowPageComponent } from '@components/show-page.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
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
<app-show-page [id]="data?.sessionId ?? null" [data]="data" [sharableURL]="sharableURL" [statuses]="statuses" [actionsButton]="actionButtons" (refresh)="onRefresh()">
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
export class ShowComponent implements SessionShowComponent, OnInit, AfterViewInit {
  sharableURL = '';
  data: SessionRaw | null = null;
  refresh: Subject<void> = new Subject<void>();
  id: string;
  cancel$ = new Subject<void>();

  _iconsService = inject(IconsService);
  _shareURLService = inject(ShareUrlService);
  _sessionsStatusesService = inject(SessionsStatusesService);
  _notificationService = inject(NotificationService);
  _grpcService = inject(SessionsGrpcService);
  _route = inject(ActivatedRoute);
  _filtersService = inject(FiltersService);

  actionData: showActionSessionData =  {
    partitionQueryParams: {},
    resultsQueryParams: {},
    tasksQueryParams: {}
  };

  actionButtons: ShowActionButton[] = [
    {
      name: $localize`See tasks`,
      icon: this._iconsService.getPageIcon('tasks'),
      link: '/tasks',
      queryParams: this.actionData.tasksQueryParams
    },
    {
      name: $localize`See results`,
      icon: this._iconsService.getPageIcon('results'),
      link: '/results',
      queryParams: this.actionData.resultsQueryParams
    },
    {
      name: $localize`See partitions`,
      icon: this._iconsService.getPageIcon('partitions'),
      link: '/partitions',
      queryParams: this.actionData.partitionQueryParams
    },
    {
      name: $localize`Cancel Session`,
      icon: this._iconsService.getIcon('cancel'),
      action$: this.cancel$,
      disabled: this.canCancel(),
      color: 'accent',
      area: 'right'
    }
  ];

  ngOnInit(): void {
    this.sharableURL = this._shareURLService.generateSharableURL(null, null);
  }

  ngAfterViewInit(): void {
    this.refresh.pipe(
      switchMap(() => {
        return this._grpcService.get$(this.id);
      }),
      map((data) => {
        return data.session ?? null;
      }),
      catchError(error => {
        this._notificationService.error($localize`Could not retrieve session.`);
        console.error(error);
        return of(null);
      })
    ).subscribe((data) => {
      if (data) {
        this.data = data;
        this.setPartitionQueryParams();
        this.setResultsQueryParams();
        this.setTasksQueryparams();
      }
    });

    this._route.params.pipe(
      map(params => params['id']),
    ).subscribe(id => {
      this.id = id;
      this.refresh.next();
    });

    this.cancel$.subscribe(() => {
      this.cancelSession();
    });
  }

  get statuses() {
    return this._sessionsStatusesService.statuses;
  }

  getPageIcon(page: Page) {
    return this._iconsService.getPageIcon(page);
  }

  getIcon(name: string): string {
    return this._iconsService.getIcon(name);
  }

  cancelSession(): void {
    if(!this.data?.sessionId) {
      return;
    }

    this._grpcService.cancel$(this.data.sessionId).subscribe({
      complete: () => {
        this._notificationService.success('Session canceled');
        this.refresh.next();
      },
      error: (error) => {
        console.error(error);
        this._notificationService.error('Unable to cancel session');
      },
    });
  }

  setPartitionQueryParams() {
    if (this.data) {
      this.data.partitionIds.forEach((partitionId, index) => {
        const keyPartition = this._filtersService.createQueryParamsKey<PartitionRawEnumField>(index, 'root' , FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID);
        this.actionData.partitionQueryParams[keyPartition] = partitionId;
      });
    }
  }

  setResultsQueryParams() {
    if (this.data) {
      const keyResults = this._filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
      this.actionData.resultsQueryParams[keyResults] = this.data.sessionId; 
    }
  }

  setTasksQueryparams() {
    if (this.data) {
      const keyTask = this._filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
      this.actionData.resultsQueryParams[keyTask] = this.data.sessionId; 
    }
  }

  canCancel(): boolean {
    return this._sessionsStatusesService.sessionNotEnded(this.data?.status ?? SessionStatus.SESSION_STATUS_UNSPECIFIED);
  }

  onRefresh(): void {
    this.refresh.next();
  }
}
