import { CancelSessionResponse, CloseSessionResponse, DeleteSessionResponse, FilterStringOperator, GetSessionResponse, PauseSessionResponse, PurgeSessionResponse, ResultRawEnumField, ResumeSessionResponse, SessionStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Params, Router, RouterModule } from '@angular/router';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksInspectionService } from '@app/tasks/services/tasks-inspection.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskOptions } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { AppShowComponent } from '@app/types/components/show';
import { StatusLabelColor } from '@app/types/status';
import { ShowPageComponent } from '@components/show-page.component';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { TableStorageService } from '@services/table-storage.service';
import { TableURLService } from '@services/table-url.service';
import { TableService } from '@services/table.service';
import { UtilsService } from '@services/utils.service';
import { Subject, catchError, map, of, switchMap } from 'rxjs';
import { SessionsFiltersService } from './services/sessions-filters.service';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionsInspectionService } from './services/sessions-inspection.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRaw } from './types';

@Component({
  selector: 'app-sessions-show',
  templateUrl: 'show.component.html',
  styleUrl: '../../inspections.css',
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
    FiltersService,
    TasksGrpcService,
    TasksFiltersService,
    TasksStatusesService,
    GrpcSortFieldService,
    SessionsInspectionService,
    TasksInspectionService,
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowComponent extends AppShowComponent<SessionRaw, GetSessionResponse> implements OnInit, OnDestroy {
  lowerDate: Timestamp | undefined;
  upperDate: Timestamp | undefined;
  lowerDuration$ = new Subject<void>();
  upperDuration$ = new Subject<void>();
  computeDuration$ = new Subject<void>();

  readonly grpcService = inject(SessionsGrpcService);
  readonly inspectionService = inject(SessionsInspectionService);
  readonly tasksInspectionService = inject(TasksInspectionService);

  private readonly sessionsStatusesService = inject(SessionsStatusesService);
  private readonly filtersService = inject(FiltersService);
  private readonly router = inject(Router);

  disablePause: boolean = false;
  disableResume: boolean = false;
  disableCancel: boolean = false;
  disableClose: boolean = false;
  disablePurge: boolean = true;

  tasksKey: string = '';
  tasksQueryParams: Params = {};

  partitionsQueryParams: Params = {};

  resultsKey: string = '';
  resultsQueryParams: Params = {};

  optionsFields: Field<TaskOptions>[];

  arrays: Field<SessionRaw>[];

  private _status: StatusLabelColor | undefined;

  get status(): StatusLabelColor | undefined {
    return this._status;
  }

  set status(value: SessionStatus | undefined) {
    this._status = value ? this.statuses[value] : undefined;
  }

  ngOnInit(): void {
    this.subscribeToDuration();
    this.initInspection();
    this.arrays = this.inspectionService.arrays;
    this.optionsFields = this.tasksInspectionService.optionsFields;
    this.resultsKey = this.filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
    this.tasksKey = this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getDataFromResponse(data: GetSessionResponse): SessionRaw | undefined {
    return data.session;
  }

  afterDataFetching(): void {
    const data = this.data();
    this.status = data?.status;
    if (data) {
      this.createResultsQueryParams();
      this.createTasksQueryParams();
      this.partitionsQueryParams = this.filtersService.createFilterPartitionQueryParams(data.partitionIds);
      this.disablePause = !this.sessionsStatusesService.canPause(data.status);
      this.disableResume = !this.sessionsStatusesService.canResume(data.status);
      this.disableCancel = !this.sessionsStatusesService.canCancel(data.status);
      this.disableClose = !this.sessionsStatusesService.canClose(data.status);
      this.disablePurge = !this.sessionsStatusesService.canPurge(data.status);
      this.lowerDuration$.next();
      this.upperDuration$.next();
    }  
  }

  get statuses() {
    return this.sessionsStatusesService.statuses;
  }

  createResultsQueryParams() {
    this.resultsQueryParams[this.resultsKey] = this.data()?.sessionId;
  }

  createTasksQueryParams() {
    this.tasksQueryParams[this.tasksKey] = this.data()?.sessionId;
  }

  subscribeToDuration() {
    const lowerDurationSubscription = this.lowerDuration$.pipe(
      switchMap(() => {
        return this.grpcService.getTaskData$(this.id, 'createdAt', 'asc').pipe(map(d => d.date));
      })
    ).subscribe((data) => {
      this.lowerDate = data;
      this.computeDuration$.next();
    });

    const upperDurationSubscription = this.upperDuration$.pipe(
      switchMap(() => {
        return this.grpcService.getTaskData$(this.id, 'endedAt', 'desc').pipe(map(d => d.date));
      })
    ).subscribe((data) => {
      this.upperDate = data;
      this.computeDuration$.next();
    });

    const computeDurationSubscription = this.computeDuration$.subscribe(() => {
      const data = this.data();
      if (data && this.lowerDate && this.upperDate) {
        data.duration = new Duration({
          seconds: (Number(this.upperDate.seconds) - Number(this.lowerDate.seconds)).toString(),
          nanos: Math.abs(this.upperDate.nanos - this.lowerDate.nanos)
        });
        this.data.set(data);
      }
    });

    this.subscriptions.add(lowerDurationSubscription);
    this.subscriptions.add(upperDurationSubscription);
    this.subscriptions.add(computeDurationSubscription);
  }

  cancel(): void {
    const data: SessionRaw | null = this.data();
    if(data?.sessionId) {
      this.grpcService.cancel$(data.sessionId)
        .pipe(
          catchError((error) => {
            console.error(error);
            this.error(error);
            return of(undefined);
          })
        )
        .subscribe((response) => {
          if (response !== undefined) {
            if (response instanceof CancelSessionResponse) {
              this.success('Session Cancelled.');
              this.refresh.next();
            } else {
              this.handleBlockAction(response, 'Cancel');
            }
          }
        });
    }
  }

  purge(): void {
    const data: SessionRaw | null = this.data();
    if (data?.sessionId) {
      this.grpcService.purge$(data.sessionId)
        .pipe(
          catchError((error) => {
            console.error(error);
            this.error(error);
            return of(undefined);
          })
        )
        .subscribe((response) => {
          if (response !== undefined) {
            if (response instanceof PurgeSessionResponse) {
              this.success('Session Purged.');
              this.refresh.next();
            } else {
              this.handleBlockAction(response, 'Purge');
            }
          }
        });
    }
  }

  pause(): void {
    const data: SessionRaw | null = this.data();
    if(data?.sessionId) {
      this.grpcService.pause$(data.sessionId)
        .pipe(
          catchError((error) => {
            console.error(error);
            this.error(error);
            return of(undefined);
          })
        )
        .subscribe((response) => {
          if (response !== undefined) {
            if (response instanceof PauseSessionResponse) {
              this.success('Session Paused.');
              this.refresh.next();
            } else {
              this.handleBlockAction(response, 'Pause');
            }
          }
        });
    }
  }

  resume(): void {
    const data: SessionRaw | null = this.data();
    if(data?.sessionId) {
      this.grpcService.resume$(data.sessionId)
        .pipe(
          catchError((error) => {
            console.error(error);
            this.error(error);
            return of(undefined);
          })
        )
        .subscribe((response) => {
          if (response !== undefined) {
            if (response instanceof ResumeSessionResponse) {
              this.success('Session Resumed.');
              this.refresh.next();
            } else {
              this.handleBlockAction(response, 'Resume');
            }
          }
        });
    }
  }

  close(): void {
    const data: SessionRaw | null = this.data();
    if(data?.sessionId) {
      this.grpcService.close$(data.sessionId)
        .pipe(
          catchError((error) => {
            console.error(error);
            this.error(error);
            return of(undefined);
          })
        )
        .subscribe((response) => {
          if (response !== undefined) {
            if (response instanceof CloseSessionResponse) {
              this.success('Session Closed.');
              this.refresh.next();
            } else {
              this.handleBlockAction(response, 'Close');
            }
          }
        });
    }
  }

  deleteSession(): void {
    const data: SessionRaw | null = this.data();
    if(data?.sessionId) {
      this.grpcService.delete$(data.sessionId)
        .pipe(
          catchError((error) => {
            console.error(error);
            this.error(error);
            return of(undefined);
          })
        )
        .subscribe((response) => {
          if (response !== undefined) {
            if (response instanceof DeleteSessionResponse) {
              this.success('Session Deleted.');
              this.router.navigate(['/sessions']);
            } else {
              this.handleBlockAction(response, 'Delete');
            }
          }
        });
    }
  }
}
