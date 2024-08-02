import { FilterStringOperator, GetSessionResponse, ResultRawEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { Subject, map, switchMap } from 'rxjs';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksInspectionService } from '@app/tasks/services/tasks-inspection.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { AppShowComponent, ShowActionButton, ShowActionInterface, ShowCancellableInterface, ShowClosableInterface } from '@app/types/components/show';
import { ShowPageComponent } from '@components/show-page.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
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
import { SessionsInspectionService } from './services/sessions-inspection.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRaw } from './types';

@Component({
  selector: 'app-sessions-show',
  template: `
<app-show-page [id]="id" [data]="data()" [sharableURL]="sharableURL" [statuses]="statuses" [actionsButton]="actionButtons" (refresh)="onRefresh()">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('sessions')"></mat-icon>
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowComponent extends AppShowComponent<SessionRaw, GetSessionResponse>
  implements OnInit, AfterViewInit, ShowActionInterface, ShowCancellableInterface, ShowClosableInterface, OnDestroy {

  cancel$ = new Subject<void>();
  pause$ = new Subject<void>();
  resume$ = new Subject<void>();
  close$ = new Subject<void>();
  delete$ = new Subject<void>();
  lowerDuration$ = new Subject<void>();
  upperDuration$ = new Subject<void>();
  computeDuration$ = new Subject<void>();

  lowerDate: Timestamp | undefined;
  upperDate: Timestamp | undefined;

  readonly grpcService = inject(SessionsGrpcService);
  readonly inspectionService = inject(SessionsInspectionService);
  readonly TasksInspectionService = inject(TasksInspectionService);

  private readonly sessionsStatusesService = inject(SessionsStatusesService);
  private readonly filtersService = inject(FiltersService);
  private readonly router = inject(Router);

  canPause$ = new Subject<boolean>();
  canResume$ = new Subject<boolean>();
  canCancel$ = new Subject<boolean>();
  canClose$ = new Subject<boolean>();

  actionButtons: ShowActionButton[] = [
    {
      id: 'tasks',
      name: $localize`See tasks`,
      icon: this.getIcon('tasks'),
      link: '/tasks',
      queryParams: {},
    },
    {
      id: 'results',
      name: $localize`See results`,
      icon: this.getIcon('results'),
      link: '/results',
      queryParams: {},
    },
    {
      id: 'partitions',
      name: $localize`See partitions`,
      icon: this.getIcon('partitions'),
      link: '/partitions',
      queryParams: {},
    },
    {
      id: 'pause',
      name: $localize`Pause Session`,
      icon: this.getIcon('pause'),
      action$: this.pause$,
      disabled: this.canPause$,
      color: 'accent',
      area: 'right'
    },
    {
      id: 'resume',
      name: $localize`Resume Session`,
      icon: this.getIcon('play'),
      action$: this.resume$,
      disabled: this.canResume$,
      color: 'accent',
      area: 'right'
    },
    {
      id: 'cancel',
      name: $localize`Cancel Session`,
      icon: this.getIcon('cancel'),
      action$: this.cancel$,
      disabled: this.canCancel$,
      color: 'accent',
      area: 'right'
    },
    {
      id: 'close',
      name: $localize`Close Session`,
      icon: this.getIcon('close'),
      action$: this.close$,
      disabled: this.canClose$,
      color: 'accent',
      area: 'right'
    },
    {
      id: 'delete',
      name: $localize`Delete Session`,
      icon: this.getIcon('delete'),
      action$: this.delete$,
      color: 'accent',
      area: 'right'
    }
  ];

  ngOnInit(): void {
    this.getIdByRoute();
    this.sharableURL = this.getSharableUrl();
  }

  ngAfterViewInit(): void {
    this.subscribeToData();
    this.subscribeToDuration();
    this.subscribeToInteractions();
    this.refresh.next();
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getDataFromResponse(data: GetSessionResponse): SessionRaw | undefined {
    return data.session;
  }

  afterDataFetching(): void {
    const data = this.data();
    if (data) {
      this.lowerDuration$.next();
      this.upperDuration$.next();
      this.filtersService.createFilterPartitionQueryParams(this.actionButtons, data.partitionIds);
      this.filtersService.createFilterQueryParams(this.actionButtons, 'results', this.resultsKey(), data.sessionId);
      this.filtersService.createFilterQueryParams(this.actionButtons, 'tasks', this.tasksKey(), data.sessionId);
      this.canPause$.next(!this.sessionsStatusesService.canPause(data.status));
      this.canResume$.next(!this.sessionsStatusesService.canResume(data.status));
      this.canCancel$.next(!this.sessionsStatusesService.canCancel(data.status));
      this.canClose$.next(!this.sessionsStatusesService.canClose(data.status));
    }  
  }

  get statuses() {
    return this.sessionsStatusesService.statuses;
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
        data.duration = {
          seconds: (Number(this.upperDate.seconds) - Number(this.lowerDate.seconds)).toString(),
          nanos: Math.abs(this.upperDate.nanos - this.lowerDate.nanos)
        };
        this.data.set({...data});
      }
    });

    this.subscriptions.add(lowerDurationSubscription);
    this.subscriptions.add(upperDurationSubscription);
    this.subscriptions.add(computeDurationSubscription);
  }

  subscribeToInteractions() {
    const cancelSubscription = this.cancel$.subscribe(() => {
      this.cancel();
    });

    const pauseSubscription = this.pause$.subscribe(() => {
      this.pause();
    });

    const resumeSubscription = this.resume$.subscribe(() => {
      this.resume();
    });

    const deleteSubscription = this.delete$.subscribe(() => {
      this.delete();
    });

    const closeSubscription = this.close$.subscribe(() => {
      this.close();
    });

    this.subscriptions.add(cancelSubscription);
    this.subscriptions.add(pauseSubscription);
    this.subscriptions.add(resumeSubscription);
    this.subscriptions.add(deleteSubscription);
    this.subscriptions.add(closeSubscription);
  }

  cancel(): void {
    const data = this.data();
    if(data?.sessionId) {
      this.grpcService.cancel$(data.sessionId).subscribe({
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
  }

  pause(): void {
    const data = this.data();
    if(data?.sessionId) {
      this.grpcService.pause$(data.sessionId).subscribe({
        complete: () => {
          this.success('Session paused');
          this.refresh.next();
        },
        error: (error) => {
          console.error(error);
          this.error('Unable to pause session');
        },
      });
    }
  }

  resume(): void {
    const data = this.data();
    if(data?.sessionId) {
      this.grpcService.resume$(data.sessionId).subscribe({
        complete: () => {
          this.success('Session resumed');
          this.refresh.next();
        },
        error: (error) => {
          console.error(error);
          this.error('Unable to resume session');
        },
      });
    }
  }

  close(): void {
    const data = this.data();
    if(data?.sessionId) {
      this.grpcService.close$(data.sessionId).subscribe({
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
  }

  delete(): void {
    const data = this.data();
    if(data?.sessionId) {
      this.grpcService.delete$(data.sessionId).subscribe({
        complete: () => {
          this.success('Session deleted');
          this.router.navigate(['/sessions']);
        },
        error: (error) => {
          console.error(error);
          this.error('Unable to delete session');
        },
      });
    }
  }

  resultsKey() {
    return this.filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
  }

  tasksKey() {
    return this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
  }
}
