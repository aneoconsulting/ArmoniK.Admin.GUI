import { FilterStringOperator, ResultRawEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { Subject, catchError, map, switchMap } from 'rxjs';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
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
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { SessionRaw } from './types';

@Component({
  selector: 'app-sessions-show',
  template: `
<app-show-page [id]="data?.sessionId ?? ''" [data$]="data$" [sharableURL]="sharableURL" [statuses]="statuses" [actionsButton]="actionButtons" (refresh)="onRefresh()">
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
  ],
  imports: [
    ShowPageComponent,
    MatIconModule,
  ]
})
export class ShowComponent extends AppShowComponent<SessionRaw, SessionsGrpcService> implements OnInit, AfterViewInit, ShowActionInterface, ShowCancellableInterface, ShowClosableInterface {
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

  private _sessionsStatusesService = inject(SessionsStatusesService);
  protected override _grpcService = inject(SessionsGrpcService);
  private _filtersService = inject(FiltersService);
  private router = inject(Router);


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
        this.lowerDuration$.next();
        this.upperDuration$.next();
        this.data$.next(data);
        this._filtersService.createFilterPartitionQueryParams(this.actionButtons, this.data.partitionIds);
        this._filtersService.createFilterQueryParams(this.actionButtons, 'results', this.resultsKey, this.data.sessionId);
        this._filtersService.createFilterQueryParams(this.actionButtons, 'tasks', this.tasksKey, this.data.sessionId);
        this.canPause$.next(!this._sessionsStatusesService.canPause(this.data.status));
        this.canResume$.next(!this._sessionsStatusesService.canResume(this.data.status));
        this.canCancel$.next(!this._sessionsStatusesService.canCancel(this.data.status));
        this.canClose$.next(!this._sessionsStatusesService.canClose(this.data.status));
      }
    });

    this.getIdByRoute();
    this.cancel$.subscribe(() => {
      this.cancel();
    });

    this.pause$.subscribe(() => {
      this.pause();
    });

    this.resume$.subscribe(() => {
      this.resume();
    });

    this.delete$.subscribe(() => {
      this.delete();
    });

    this.close$.subscribe(() => {
      this.close();
    });

    this.lowerDuration$.pipe(
      switchMap(() => {
        return this._grpcService.getTaskData$(this.id, 'createdAt', 'asc').pipe(map(d => d.date));
      })
    ).subscribe((data) => {
      this.lowerDate = data;
      this.computeDuration$.next();
    });

    this.upperDuration$.pipe(
      switchMap(() => {
        return this._grpcService.getTaskData$(this.id, 'endedAt', 'desc').pipe(map(d => d.date));
      })
    ).subscribe((data) => {
      this.upperDate = data;
      this.computeDuration$.next();
    });

    this.computeDuration$.subscribe(() => {
      if (this.data && this.lowerDate && this.upperDate) {
        this.data.duration = {
          seconds: (Number(this.upperDate.seconds) - Number(this.lowerDate.seconds)).toString(),
          nanos: Math.abs(this.upperDate.nanos - this.lowerDate.nanos)
        };
      }
    });
  }

  get statuses() {
    return this._sessionsStatusesService.statuses;
  }

  cancel(): void {
    if(this.data?.sessionId) {
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
  }

  pause(): void {
    if(this.data?.sessionId) {
      this._grpcService.pause$(this.data.sessionId).subscribe({
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
    if(this.data?.sessionId) {
      this._grpcService.resume$(this.data.sessionId).subscribe({
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
    if(this.data?.sessionId) {
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
  }

  delete(): void {
    if(this.data?.sessionId) {
      this._grpcService.delete$(this.data.sessionId).subscribe({
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

  get resultsKey() {
    return this._filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
  }

  get tasksKey() {
    return this._filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
  }
}
