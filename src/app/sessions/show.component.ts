import { FilterStringOperator, GetSessionResponse, ResultRawEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Params, Router, RouterModule } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { Subject, map, switchMap } from 'rxjs';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksInspectionService } from '@app/tasks/services/tasks-inspection.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskOptions } from '@app/tasks/types';
import { Field } from '@app/types/column.type';
import { AppShowComponent } from '@app/types/components/show';
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
<app-show-page [id]="id" [data]="data()" [sharableURL]="sharableURL" [status]="status" [fields]="fields" [optionsFields]="optionsFields" [arrays]="arrays" [statuses]="statuses" (refresh)="onRefresh()">
  <div class="title" title>
    <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('sessions')"></mat-icon>
    <span i18n="Page title"> Sessions </span>
  </div>
  <div class="actions" actions>
    <button mat-button [routerLink]="'/tasks'" [queryParams]="tasksQueryParams">
      <span i18n>See Tasks</span>
      <mat-icon [fontIcon]="getIcon('tasks')" />
    </button>
    <button mat-button [routerLink]="'/results'" [queryParams]="resultsQueryParams">
      <span i18n>See Results</span>
      <mat-icon [fontIcon]="getIcon('results')" />
    </button>
    <button mat-button [routerLink]="'/partitions'" [queryParams]="partitionsQueryParams">
      <span i18n>See Partition</span>
      <mat-icon [fontIcon]="getIcon('partitions')" />
    </button>
  </div>
  <div class="actions" bonus-actions>
    @if (!disableResume) {
      <button mat-flat-button color="accent" (click)="resume()" [disabled]="disableResume">
        <span i18n>Resume Session</span>
        <mat-icon [fontIcon]="this.getIcon('play')" />
      </button>
    } @else {
      <button mat-flat-button color="accent" (click)="pause()" [disabled]="disablePause">
        <span i18n>Pause Session</span>
        <mat-icon [fontIcon]="this.getIcon('pause')" />
      </button>
    }
    <button mat-flat-button color="accent" (click)="cancel()" [disabled]="disableCancel">
      <span i18n>Cancel Session</span>
      <mat-icon [fontIcon]="this.getIcon('cancel')" />
    </button>
    <button mat-flat-button color="accent" (click)="close()" [disabled]="disableClose">
      <span i18n>Close Session</span>
      <mat-icon [fontIcon]="this.getIcon('close')" />
    </button>
    <button mat-flat-button color="accent" (click)="deleteSession()">
      <span i18n>Delete Session</span>
      <mat-icon [fontIcon]="this.getIcon('delete')" />
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

  tasksKey: string = '';
  tasksQueryParams: Params = {};

  partitionsQueryParams: Params = {};

  resultsKey: string = '';
  resultsQueryParams: Params = {};

  status: string | undefined;

  optionsFields: Field<TaskOptions>[];

  arrays: Field<SessionRaw>[];

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
    if (data) {
      this.status = this.statuses[data.status];
      this.createResultsQueryParams();
      this.createTasksQueryParams();
      this.partitionsQueryParams = this.filtersService.createFilterPartitionQueryParams(data.partitionIds);
      this.disablePause = !this.sessionsStatusesService.canPause(data.status);
      this.disableResume = !this.sessionsStatusesService.canResume(data.status);
      this.disableCancel = !this.sessionsStatusesService.canCancel(data.status);
      this.disableClose = !this.sessionsStatusesService.canClose(data.status);
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
        data.duration = {
          seconds: (Number(this.upperDate.seconds) - Number(this.lowerDate.seconds)).toString(),
          nanos: Math.abs(this.upperDate.nanos - this.lowerDate.nanos)
        };
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
    const data: SessionRaw | null = this.data();
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
    const data: SessionRaw | null = this.data();
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
    const data: SessionRaw | null = this.data();
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

  deleteSession(): void {
    const data: SessionRaw | null = this.data();
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
}
