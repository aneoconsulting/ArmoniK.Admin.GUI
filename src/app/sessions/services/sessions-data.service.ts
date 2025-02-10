import { FilterDateOperator, FilterStringOperator, ListSessionsResponse, ResultRawEnumField, SessionRawEnumField, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Params } from '@angular/router';
import { TaskOptions, TaskSummaryFilters } from '@app/tasks/types';
import { Scope } from '@app/types/config';
import { ColumnKey, SessionData } from '@app/types/data';
import { Filter, FiltersOr } from '@app/types/filters';
import { Group, GroupConditions } from '@app/types/groups';
import { ListOptions } from '@app/types/options';
import { AbstractTableDataService } from '@app/types/services/table-data.service';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { InvertFilterService } from '@services/invert-filter.service';
import { Subject, map, merge, mergeAll, switchMap } from 'rxjs';
import { SessionsGrpcService } from './sessions-grpc.service';
import { SessionRaw } from '../types';

@Injectable()
export class SessionsDataService extends AbstractTableDataService<SessionRaw, SessionRawEnumField, TaskOptions, TaskOptionEnumField> implements OnDestroy {
  readonly grpcService = inject(SessionsGrpcService);
  readonly invertFiltersService: InvertFilterService<SessionRawEnumField, TaskOptionEnumField> = inject(InvertFilterService);

  scope: Scope = 'sessions';

  groups: Group<SessionRaw, TaskOptions>[] = [];

  groupsConditions: GroupConditions<SessionRawEnumField, TaskOptionEnumField>[] = [
    {
      name: 'Group 1',
      conditions: [
        [
          {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: '335af491-ff89-4b9a-8952-8cb2e800be65'
          }
        ],
        [
          {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: '03b69175-b3fb-47e4-b1b1-b5a6ab302601'
          }
        ]
      ]
    }
  ];

  constructor() {
    super();
    this.subscribeToDurationSubjects();
    this.setGroups();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  computeGrpcData(entries: ListSessionsResponse): SessionRaw[] | undefined {
    return entries.sessions;
  }

  // Creating new data

  override handleData(entries: SessionRaw[]): void {
    this.dataRaw = entries;
    if (this.isDurationDisplayed && entries.length !== 0) {
      this.startComputingDuration(entries);
    } else {
      super.handleData(entries); 
    }
  }

  override prepareOptions(): ListOptions<SessionRaw, TaskOptions> {
    const options = super.prepareOptions();
    if (this.isDurationDisplayed && this.options.sort.active === 'duration') {
      options.sort.active = 'createdAt';
      this.isDurationSorted = true;
      if (this.filtersHaveNoCreatedAt()) {
        options.pageSize = 100;
      }
    } else {
      this.isDurationSorted = false;
    }
    return options;
  }

  override preparefilters(): FiltersOr<SessionRawEnumField, TaskOptionEnumField> {
    const filtersOr = super.preparefilters();
    this.groupsConditions.forEach((groupConditions) => (filtersOr.push(...this.invertFiltersService.invert(groupConditions.conditions))));
    if(this.isDurationDisplayed && this.options.sort.active === 'duration') {
      const date = new Date();
      date.setDate(date.getDate() - 3);
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: Math.floor(date.getTime()/1000)
      };
      if (filtersOr.length !== 0) {
        filtersOr.forEach(filtersAnd => {
          if (filtersAnd.find(filter => filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT) === undefined) {
            filtersAnd.push(filter);
          }
        });
      } else {
        filtersOr.push([filter]);
      }
    }
    return filtersOr;
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

  /**
   * Create a basic filter for the task table. 
   */
  createSessionIdQueryParams(sessionId: string) {
    const keySession = this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(0, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID);

    return {
      [keySession]: sessionId,
    };
  }

  /**
   * Create the queryParams used by the taskByStatus component to redirect to the task table.
   * The partitionId filter is applied on top of every filter of the table.
   */
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

  /**
   * Create the filter key used by the query params.
   */
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

  /**
   * Create the query params to filter the result table with the current applied filters.
   */
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

  /**
   * Create the filter used by the **TaskByStatus** component.
   */
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

  initGroup(groupCondition: GroupConditions<SessionRawEnumField, TaskOptionEnumField>) {
    const groupRefresh$ = new Subject<void>();
    const group: Group<SessionRaw, TaskOptions> = {
      name: groupCondition.name,
      opened: false,
      total: 0,
      page: 0,
      refresh$: groupRefresh$,
      data: merge(this.refresh$, groupRefresh$).pipe(
        switchMap(() => this.grpcService.list$({pageSize: 100, pageIndex: group.page, sort: this.options.sort}, groupCondition.conditions)),
        map((data) => {
          group.total = data.total;
          return this.computeGrpcData(data);
        }),
        map((data) => {
          if (data) {
            return data.map(entry => this.createNewLine(entry));
          }
          return [];
        })
      )
    };

    this.groups.push(group);
  }

  setGroups() {
    this.groupsConditions.forEach((g) => this.initGroup(g));
  }

  addGroup(groupCondition: GroupConditions<SessionRawEnumField, TaskOptionEnumField>) {
    this.groupsConditions.push(groupCondition);
    this.initGroup(groupCondition);
  }

  refreshGroup(groupName: string) {
    const group = this.groups.find((group) => group.name === groupName);
    if (group) {
      group.refresh$.next();
    }
  }

  removeGroup(groupName: string) {
    this.groups = this.groups.filter((group) => group.name !== groupName);
  }

  // Duration computation
  isDurationDisplayed = false;
  private dataRaw: SessionRaw[];
  private isDurationSorted = false;
  private sessionEndedDates: {sessionId: string, date: Timestamp | undefined}[] = [];
  private sessionCreationDates: {sessionId: string, date: Timestamp | undefined}[] = [];
  private readonly nextStartDuration$ = new Subject<string>();
  private readonly nextEndDuration$ = new Subject<string>();
  private readonly computeDuration$ = new Subject<void>();
  private readonly sessionsIdsComputationError: string[] = [];

  /**
   * Start the duration computation process
   */
  private startComputingDuration(data: SessionRaw[]) {
    data.forEach(session => {
      this.nextStartDuration$.next(session.sessionId);
      this.nextEndDuration$.next(session.sessionId);
    });
  }

  /**
   * Subscribe to the following subjects:
   * - **computeDuration$**: Will compute the duration when the **sessionEndedDates** and **sessionCreationDates** length are equals to the dataRaw length.
   * To compute the duration, it will use the creation date of the first task of a session, and the end date of its last task.
   * The duration is simply a soustraction between those two values.
   * - **nextStartDuration**: aims to fetch the first task *startedAt** field of a session.
   * - **nextEndDuration**: aims to fetch the last task **endedAt** field of a session.
   */
  private subscribeToDurationSubjects() {
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
              this.computationErrorNotification(key);
            }
          }
        });
        if (this.isDurationSorted) {
          this.orderByDuration(this.dataRaw);
        } else {
          super.handleData(this.dataRaw);
        }
        this.sessionEndedDates = [];
        this.sessionCreationDates = [];
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

  /**
   * Sort a SessionRaw array by the field *duration*.
   */
  private orderByDuration(data: SessionRaw[]) {
    data = data.toSorted((a, b) => {
      if (this.options.sort.direction === 'asc') {
        return Number(a.duration?.seconds) - Number(b.duration?.seconds);
      } else {
        return Number(b.duration?.seconds) - Number(a.duration?.seconds);
      }
    }).slice(0, this.options.pageSize);
    super.handleData(data);
  }

  /**
   * Will push a date to either **sessionEndedDates** or **sessionCreationDates**. 
   * After this, the **computeDuration$** subject will be called to know if durations can be computed.
   * @param data - a sessionId and its "endedAt" or "startedAt" date.
   * @param type - Either ended or created, to put the date respectively in **sessionEndedDates** or **sessionCreationDates**.
   */
  private durationSubscription(data: {sessionId: string, date: Timestamp | undefined}, type: 'ended' | 'created') {
    if (type === 'ended') {
      this.sessionEndedDates.push({sessionId: data.sessionId, date: data.date});
    } else {
      this.sessionCreationDates.push({sessionId: data.sessionId, date: data.date});
    }
    this.computeDuration$.next();
  }

  /**
   * Check if the current applied filters include the field "createdAt".
   */
  private filtersHaveNoCreatedAt() {
    for (const filterAnd of this.filters) {
      const result = filterAnd.some(filter => filter.field === SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT);
      if (result) {
        return false;
      }
    }
    return true;
  }

  /**
   * Will display warning message to the user saying that a session duration could not be computed.
   * The message is displayed only once for each sessionId, while the user stays on the session table.
   */
  private computationErrorNotification(sessionId: string) {
    if (!this.sessionsIdsComputationError.includes(sessionId)) {
      this.sessionsIdsComputationError.push(sessionId);
      this.warning('Error while computing duration for session: ' + sessionId);
    }
  }

  // Session Interactions

  onPause(sessionId: string) {
    this.grpcService.pause$(sessionId)
      .subscribe(
        {
          error: (error) => this.error(error, 'Unable to pause session'),
          complete: () => this.refresh$.next()
        }
      );
  }

  onResume(sessionId: string) {
    this.grpcService.resume$(sessionId).subscribe(
      {
        error: (error) => this.error(error, 'Unable to resume session'),
        complete: () => this.refresh$.next()
      }
    );
  }

  onCancel(sessionId: string) {
    this.grpcService.cancel$(sessionId).subscribe(
      {
        error: (error) => this.error(error, 'Unable to cancel session'),
        complete: () => this.refresh$.next()
      }
    );
  }

  onPurge(sessionId: string) {
    this.grpcService.purge$(sessionId).subscribe(
      {
        error: (error) => this.error(error, 'Unable to purge session'),
        complete: () => this.refresh$.next()
      }
    );
  }

  onClose(sessionId: string) {
    this.grpcService.close$(sessionId).subscribe(
      {
        error: (error) => this.error(error, 'Unable to close session'),
        complete: () => this.refresh$.next()
      }
    );
  }

  onDelete(sessionId: string) {
    this.grpcService.delete$(sessionId).subscribe(
      {
        error: (error) => this.error(error, 'Unable to delete session'),
        complete: () => this.refresh$.next()
      }
    );
  }
}