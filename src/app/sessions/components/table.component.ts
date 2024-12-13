import { FilterDateOperator, FilterStringOperator, ListSessionsResponse, ResultRawEnumField, SessionRawEnumField, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard} from '@angular/cdk/clipboard';
import { AfterViewInit, Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Params, Router, RouterModule } from '@angular/router';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TaskOptions, TaskSummaryFilters } from '@app/tasks/types';
import { AbstractTableComponent, AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import { Scope } from '@app/types/config';
import { ArmonikData, ColumnKey, SessionData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { ActionTable } from '@app/types/table';
import { TableComponent } from '@components/table/table.component';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { NotificationService } from '@services/notification.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { Subject, map, mergeAll } from 'rxjs';
import { SessionsGrpcService } from '../services/sessions-grpc.service';
import { SessionsIndexService } from '../services/sessions-index.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRaw, SessionRawFilters, SessionRawListOptions } from '../types';

@Component({
  selector: 'app-sessions-table',
  standalone: true,
  templateUrl: './table.component.html',
  providers: [
    TasksByStatusService,
    MatDialog,
    FiltersService,
    Clipboard,
    TasksGrpcService,
    SessionsGrpcService,
    NotificationService,
    GrpcSortFieldService,
  ],
  imports: [
    TableComponent,
    RouterModule,
    MatDialogModule,
  ]
})
export class SessionsTableComponent extends AbstractTaskByStatusTableComponent<SessionRaw, SessionRawEnumField, TaskOptions, TaskOptionEnumField> 
  implements OnInit, AfterViewInit, AbstractTableComponent<SessionRaw, SessionRawEnumField, TaskOptions, TaskOptionEnumField> {
  @Output() cancelSession = new EventEmitter<string>();
  @Output() closeSession = new EventEmitter<string>();
  @Output() deleteSession = new EventEmitter<string>();
  
  readonly grpcService = inject(SessionsGrpcService);
  readonly indexService = inject(SessionsIndexService);
  readonly statusesService = inject(SessionsStatusesService);
  readonly router = inject(Router);
  readonly copyService = inject(Clipboard);

  scope: Scope = 'sessions'; 
  table: TableTasksByStatus = 'sessions';

  dataRaw: SessionRaw[];
  isDurationSorted: boolean = false;
  sessionEndedDates: {sessionId: string, date: Timestamp | undefined}[] = [];
  sessionCreationDates: {sessionId: string, date: Timestamp | undefined}[] = [];
  nextStartDuration$ = new Subject<string>();
  nextEndDuration$ = new Subject<string>();
  computeDuration$ = new Subject<void>();
  sessionsIdsComputationError: string[] = [];

  copy$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  copySubscription = this.copy$.subscribe(data => this.onCopiedSessionId(data));

  seeSessions$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  seeSessionsSubscription = this.seeSessions$.subscribe(data => this.router.navigate(['/sessions', data.raw.sessionId]));

  seeResults$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  seeResultsSubscription = this.seeResults$.subscribe(data => this.router.navigate(['/results'], { queryParams: (data as SessionData).resultsQueryParams }));

  pauseSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  pauseSessionSubscription = this.pauseSession$.subscribe(data => this.onPause(data.raw.sessionId));

  resumeSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  resumeSessionSubscription = this.resumeSession$.subscribe(data => this.onResume(data.raw.sessionId));

  purgeSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  purgeSessionSubscription = this.purgeSession$.subscribe(data => this.onPurge(data.raw.sessionId));

  cancelSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  cancelSessionSubscription = this.cancelSession$.subscribe(data => this.onCancel(data.raw.sessionId));

  closeSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  closeSessionSubscription = this.closeSession$.subscribe(data => this.onClose(data.raw.sessionId));

  deleteSession$ = new Subject<ArmonikData<SessionRaw, TaskOptions>>();
  deleteSessionSubscription = this.deleteSession$.subscribe(data => this.onDelete(data.raw.sessionId));

  actions: ActionTable<SessionRaw, TaskOptions>[] = [
    {
      label: 'Copy session ID',
      icon: 'copy',
      action$: this.copy$,
    },
    {
      label: 'See session',
      icon: 'sessions',
      action$: this.seeSessions$,
    },
    {
      label: 'See results',
      icon: 'results',
      action$: this.seeResults$,
    },
    {
      label: 'Pause session',
      icon: 'pause',
      action$: this.pauseSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canPause(element.raw.status)
    },
    {
      label: 'Resume session',
      icon: 'play',
      action$: this.resumeSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canResume(element.raw.status)
    },
    {
      label: 'Cancel session',
      icon: 'cancel',
      action$: this.cancelSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canCancel(element.raw.status)
    },
    {
      label: 'Purge session',
      icon: 'purge',
      action$: this.purgeSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canPurge(element.raw.status)
    },
    {
      label: 'Close session',
      icon: 'close',
      action$: this.closeSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canClose(element.raw.status)
    },
    {
      label: 'Delete session',
      icon: 'delete',
      action$: this.deleteSession$,
      condition: (element: ArmonikData<SessionRaw, TaskOptions>) => this.statusesService.canDelete(element.raw.status)
    }
  ];

  ngOnInit(): void {
    this.initTable();
  }

  ngAfterViewInit(): void {
    this.subscribeToData();
    this.computeDuration$.subscribe(() => {
      if (this.dataRaw.length === this.sessionEndedDates.length && this.dataRaw.length === this.sessionCreationDates.length) {
        const keys: string[] = this.sessionEndedDates.map(duration => duration.sessionId);
        keys.forEach(key => {
          const sessionIndex = this.dataRaw.findIndex(session => session.sessionId === key);
          if (sessionIndex !== -1) {
            const lastDuration = this.sessionEndedDates.find(duration => duration.sessionId === key)?.date;
            const firstDuration = this.sessionCreationDates.find(duration => duration.sessionId === key)?.date;
            if (firstDuration && lastDuration) {
              this.dataRaw[sessionIndex].duration = {
                seconds: (Number(lastDuration.seconds) - Number(firstDuration.seconds)).toString(),
                nanos: Math.abs(lastDuration.nanos - firstDuration.nanos)
              } as Duration;
            } else {
              this.notificationService.warning(key);
            }
          }
        });
        if (this.isDurationSorted) {
          this.orderByDuration(this.dataRaw);
        } else {
          this.newData(this.dataRaw);
        }
        this.sessionEndedDates = [];
        this.sessionCreationDates = [];
        this.loading.set(false);
      }
    });
    
    this.nextStartDuration$.pipe(
      map(sessionId => this.grpcService.getTaskData$(sessionId, 'createdAt', 'asc')),
      mergeAll(),
    ).subscribe(task => this.durationSubscription(task, 'created'));

    this.nextEndDuration$.pipe(
      map(sessionId => this.grpcService.getTaskData$(sessionId, 'endedAt', 'desc')),
      mergeAll(),
    ).subscribe(task => this.durationSubscription(task, 'ended'));
  }

  computeGrpcData(entries: ListSessionsResponse): SessionRaw[] | undefined {
    return entries.sessions;
  }

  isDataRawEqual(value: SessionRaw, entry: SessionRaw): boolean {
    return value.sessionId === entry.sessionId;
  }

  override prepareBeforeFetching(options: SessionRawListOptions, filters: SessionRawFilters): void {
    this.indexService.saveOptions(this.options);
    if(this.isDurationDisplayed() && this.options.sort.active === 'duration') {
      options.sort.active = 'createdAt';
      this.isDurationSorted = true;
      if(!this.filterHasCreatedAt(filters)) {
        options.pageSize = 100;
        const date = new Date();
        date.setDate(date.getDate() - 3);
        filters.push([{
          field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
          for: 'root',
          operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
          value: Math.floor(date.getTime()/1000)
        }]);
      }
    } else {
      this.isDurationSorted = false;
    }
  }

  override afterDataCreation(data: SessionRaw[]): void {
    if (this.isDurationDisplayed()) {
      this.dataRaw = data;
      data.forEach(session => {
        this.nextStartDuration$.next(session.sessionId);
        this.nextEndDuration$.next(session.sessionId);
      });
    } else {
      this.newData(data);
      this.loading.set(false);
    }
  }

  createNewLine(entry: SessionRaw): SessionData {
    const queryParams = new Map<ColumnKey<SessionRaw>, Params>();
    queryParams.set('sessionId', { '0-root-1-0': entry.sessionId });
    return {
      raw: entry,
      queryParams,
      resultsQueryParams: this.createResultsQueryParams(entry.sessionId),
      queryTasksParams: this.createTasksByStatusQueryParams(entry.sessionId),
      filters: this.countTasksByStatusFilters(entry.sessionId),
    };
  }

  onCopiedSessionId(data: ArmonikData<SessionRaw, TaskOptions>) {
    this.copyService.copy(data.raw.sessionId);
    this.notificationService.success('Session ID copied to clipboard');
  }

  createSessionIdQueryParams(sessionId: string) {
    const keySession = this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
  }

  createTasksByStatusQueryParams(sessionId: string) {
    if(this.filters.length === 0) {
      return this.createSessionIdQueryParams(sessionId);
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        params[`${index}-root-${TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = sessionId;
        filterAnd.forEach(filter => {
          if (filter.field !== SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID || filter.operator !== FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL) {
            const filterLabel = this.#createTaskByStatusLabel(filter, index);
            if (filterLabel && filter.value) {
              params[filterLabel] = filter.value.toString();
            }
          }
        });
      });
      return params;
    }
  }

  #createTaskByStatusLabel(filter: Filter<SessionRawEnumField, TaskOptionEnumField>, orGroup: number): string | null {
    if (filter.field !== null && filter.operator !== null) {
      if (filter.for === 'root' && filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID) {
        return this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(orGroup, 'root', filter.operator, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);
      } else if (filter.for === 'options') {
        return this.filtersService.createQueryParamsKey<TaskOptionEnumField>(orGroup, 'options', filter.operator, filter.field as TaskOptionEnumField);
      }
    }
    return null;
  }

  createResultsQueryParams(sessionId: string) {
    if(this.filters.length === 0) {
      const keySession = this.filtersService.createQueryParamsKey<ResultRawEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);

      return {
        [keySession]: sessionId
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        filterAnd.forEach(filter => {
          if (filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID && filter.operator !== FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL && filter.value !== null && filter.operator !== null) {
            const filterLabel = this.filtersService.createQueryParamsKey<ResultRawEnumField>(index, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
            if (filterLabel) params[filterLabel] = filter.value.toString();
          }
        });
        params[`${index}-root-${TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = sessionId;
      });
      return params;
    }
  }

  countTasksByStatusFilters(sessionId: string): TaskSummaryFilters {
    return [
      [
        {
          for: 'root',
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
          value: sessionId,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        }
      ]
    ];
  }

  onPause(sessionId: string) {
    this.grpcService.pause$(sessionId)
      .subscribe(
        {
          error: () => this.notificationService.error('Unable to pause session'),
          complete: () => this.refresh$.next()
        }
      );
  }

  onResume(sessionId: string) {
    this.grpcService.resume$(sessionId).subscribe(
      {
        error: () => this.notificationService.error('Unable to resume session'),
        complete: () => this.refresh$.next()
      }
    );
  }

  onCancel(sessionId: string) {
    this.grpcService.cancel$(sessionId).subscribe(
      {
        error: () => this.notificationService.error('Unable to cancel session'),
        complete: () => this.refresh$.next()
      }
    );
  }

  onPurge(sessionId: string) {
    this.grpcService.purge$(sessionId).subscribe(
      {
        error: () => this.notificationService.error('Unable to purge session'),
        complete: () => this.refresh$.next()
      }
    );
  }

  onClose(sessionId: string) {
    this.grpcService.close$(sessionId).subscribe(
      {
        error: () => this.notificationService.error('Unable to close session'),
        complete: () => this.refresh$.next()
      }
    );
  }

  onDelete(sessionId: string) {
    this.grpcService.delete$(sessionId).subscribe(
      {
        error: () => this.notificationService.error('Unable to delete session'),
        complete: () => this.refresh$.next()
      }
    );
  }

  // Session Duration computation section

  filterHasCreatedAt(filters: SessionRawFilters) {
    for (const filterAnd of filters) {
      const result = filterAnd.some(filter => filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT);
      if (result) {
        return true;
      }
    }
    return false;
  }

  isDurationDisplayed(): boolean {
    return this.displayedColumns.map(c => c.key).includes('duration');
  }

  orderByDuration(data: SessionRaw[]) {
    data = data.toSorted((a, b) => {
      if (this.options.sort.direction === 'asc') {
        return Number(a.duration?.seconds) - Number(b.duration?.seconds);
      } else {
        return Number(b.duration?.seconds) - Number(a.duration?.seconds);
      }
    }).slice(0, this.options.pageSize);
    this.newData(data);
  }

  durationSubscription(data: {sessionId: string, date: Timestamp | undefined}, type: 'ended' | 'created') {
    if (type === 'ended') {
      this.sessionEndedDates.push({sessionId: data.sessionId, date: data.date});
    } else {
      this.sessionCreationDates.push({sessionId: data.sessionId, date: data.date});
    }
    this.computeDuration$.next();
  }

  trackBy(index: number, item: ArmonikData<SessionRaw, TaskOptions>) {
    return item.raw.sessionId;
  }
}
