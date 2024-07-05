import { FilterDateOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, SessionRawEnumField, SessionStatus, SessionTaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TableColumn } from '@app/types/column.type';
import { SessionData } from '@app/types/data';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { SessionsTableComponent } from './table.component';
import { SessionsGrpcService } from '../services/sessions-grpc.service';
import { SessionsIndexService } from '../services/sessions-index.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRaw, SessionRawColumnKey, SessionRawFilters } from '../types';

describe('SessionsTableComponent', () => {
  let component: SessionsTableComponent;

  const displayedColumns: TableColumn<SessionRawColumnKey>[] = [
    {
      name: 'Session ID',
      key: 'sessionId',
      type: 'link',
      sortable: true,
      link: '/sessions',
    },
    {
      name: 'Status',
      key: 'status',
      type: 'status',
      sortable: true,
    },
    {
      name: 'Created at',
      key: 'createdAt',
      type: 'date',
      sortable: true,
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false,
    }
  ];

  const mockSessionsIndexService = {
    isActionsColumn: jest.fn(),
    isSessionIdColumn: jest.fn(),
    isStatusColumn: jest.fn(),
    isDateColumn: jest.fn(),
    isDurationColumn: jest.fn(),
    isObjectColumn: jest.fn(),
    isSelectColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn(),
    columnToLabel: jest.fn(),
    saveColumns: jest.fn(),
    saveOptions: jest.fn(),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const sessionData = { sessions: [{ sessionId: 'session1' }, { sessionId: 'session2' }, { sessionId: 'session3' }] as SessionRaw[], total: 3 };
  const taskCreatedAt: {sessionId: string, date: Timestamp | undefined} = {
    sessionId: 'sessionId',
    date: {
      seconds: '1620000000',
      nanos: 0
    } as Timestamp
  };

  const taskEndedAt: {sessionId: string, date: Timestamp | undefined} = {
    sessionId: 'sessionId',
    date: {
      seconds: '1620001000',
      nanos: 0
    } as Timestamp
  };

  const mockSessionsGrpcService = {
    list$: jest.fn((): Observable<{ sessions: { sessionId: string; }[]; total: number; } | null> => of(sessionData)),
    cancel$: jest.fn(() => of({})),
    getTaskData$: jest.fn(),
    pause$: jest.fn(() => of({})),
    resume$: jest.fn(() => of({})),
    close$: jest.fn(() => of({})),
    delete$: jest.fn(() => of({})),
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(() => defaultStatusesGroups),
    saveStatuses: jest.fn()
  };

  const defaultStatusesGroups: TasksStatusesGroup[] = [
    {
      name: 'Completed',
      statuses: [TaskStatus.TASK_STATUS_COMPLETED],
      color: '#4caf50',
    },
    {
      name: 'Error',
      statuses: [TaskStatus.TASK_STATUS_ERROR],
      color: '#ff0000',
    },
  ];

  const mockDialogReturn: ManageGroupsDialogResult = {
    groups: [
      {
        name: 'Timeout',
        statuses: [TaskStatus.TASK_STATUS_TIMEOUT],
        color: '#ff6944',
      },
      {
        name: 'Retried',
        statuses: [TaskStatus.TASK_STATUS_RETRIED],
        color: '#ff9800',
      }
    ]
  };

  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: jest.fn(() => of(mockDialogReturn))
      };
    })
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const cachedSession = { sessions: [{ sessionId: 'session1' }, { sessionId: 'session2' }] as SessionRaw[], total: 2 };
  const mockCacheService = {
    get: jest.fn(() => cachedSession),
    save: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SessionsTableComponent,
        { provide: SessionsIndexService, useValue: mockSessionsIndexService },
        { provide: SessionsGrpcService, useValue: mockSessionsGrpcService },
        SessionsStatusesService,
        FiltersService,
        { provide: CacheService, useValue: mockCacheService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService},
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: Router, useValue: mockRouter },
        IconsService
      ]
    }).inject(SessionsTableComponent);

    component.displayedColumns = displayedColumns;
    component.filters$ = new BehaviorSubject<SessionRawFilters>([]);
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'sessionId',
        direction: 'desc'
      }
    };
    component.refresh$ = new Subject();
    component.loading = signal(false);
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () =>{
    it('should load cached data from cachedService', () => {
      expect(mockCacheService.get).toHaveBeenCalled();
    });
  });

  describe('loadFromCache', () => {
    beforeEach(() => {
      component.loadFromCache();
    });

    it('should update total data with cached one', () => {
      expect(component.total).toEqual(cachedSession.total);
    });

    it('should update data with cached one', () => {
      const map1 = new Map();
      const map2 = new Map();
      map1.set('sessionId', {'0-root-1-0': 'session1'});
      map2.set('sessionId', {'0-root-1-0': 'session2'});
      expect(component.data()).toEqual([
        {
          raw: {
            sessionId: 'session1'
          },
          queryParams: map1,
          resultsQueryParams: {
            '0-root-1-0': 'session1'
          },
          queryTasksParams: {
            '0-root-1-0': 'session1'
          },
          filters: [[{for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'session1'}]]
        },
        {
          raw: {
            sessionId: 'session2'
          },
          queryParams: map2,
          resultsQueryParams: {
            '0-root-1-0': 'session2'
          },
          queryTasksParams: {
            '0-root-1-0': 'session2'
          },
          filters: [[{for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'session2'}]]
        },
      ]);
    });
  });

  it('should return columns keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(column => column.key));
  });

  it('should get page icon', () => {
    expect(component.getIcon('sessions')).toEqual('workspaces');
  });

  it('should create session id query params', () => {
    const id = 'sessionId';
    expect(component.createSessionIdQueryParams(id)).toEqual({
      '0-root-1-0': id
    });
  });

  describe('createTasksByStatusQueryParams', () => {
    const id = 'sessionId';

    it('should create simple query params if there is no filters', () => {
      expect(component.createTasksByStatusQueryParams(id)).toEqual({
        '0-root-1-0': 'sessionId'
      });
    });

    it('should create a query params with filters', () => {
      component.filters = [
        [
          {
            for: 'options',
            field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES,
            operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN,
            value: 1
          },
          {
            for: 'root', // should not appear
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
            operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
            value: SessionStatus.SESSION_STATUS_RUNNING
          },
          {
            for: 'root', // should not appear
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
            operator: null,
            value: SessionStatus.SESSION_STATUS_RUNNING
          },
        ],
        [
          {
            for: 'root', // should not appear
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: '2313893210'
          },
          {
            for: 'root',
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
            value: 'id'
          },
          {
            for: 'root', // should not appear
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
            operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
            value: null
          },
        ]
      ];
      expect(component.createTasksByStatusQueryParams(id)).toEqual({
        '0-root-1-0': id,
        '0-options-2-5': '1',
        '1-root-1-0': id,
        '1-root-1-2': 'id'
      });
    });
  });

  describe('Results query params', () => {
    const id = 'sessionId';
    it('should return the sessionId if there is no filter', () => {
      expect(component.createResultsQueryParams(id)).toEqual({
        '0-root-1-0': id
      });
    });

    it('should add filters if there is any', () => {
      component.filters = [
        [
          {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
            value: 'session1'
          },
          {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: null,
            value: 'shouldNotAppear'
          },
        ],
        [
          {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: null
          },
          {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 'session2'
          },
          {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: 'neitherShouldIt'
          },
        ]
      ];
      expect(component.createResultsQueryParams(id)).toEqual({
        '0-root-1-2': 'session1',
        '0-root-1-0': id,
        '1-root-1-4': 'session2',
        '1-root-1-0': id,
      });
    });
  });

  it('should return the tasks by status filter', () => {
    const id = 'sessionId';
    expect(component.countTasksByStatusFilters(id)).toEqual([[{
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
      value: id,
      operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
    }]]);
  });

  it('should update data on refresh', () => {
    component.refresh$.next();
    const map1 = new Map();
    const map2 = new Map();
    const map3 = new Map();
    map1.set('sessionId', {'0-root-1-0': 'session1'});
    map2.set('sessionId', {'0-root-1-0': 'session2'});
    map3.set('sessionId', {'0-root-1-0': 'session3'});
    expect(component.data()).toEqual([
      {
        raw: {
          sessionId: 'session1'
        },
        queryParams: map1,
        resultsQueryParams: {
          '0-root-1-0': 'session1'
        },
        queryTasksParams: {
          '0-root-1-0': 'session1'
        },
        filters: [[{for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'session1'}]]
      },
      {
        raw: {
          sessionId: 'session2'
        },
        queryParams: map2,
        resultsQueryParams: {
          '0-root-1-0': 'session2'
        },
        queryTasksParams: {
          '0-root-1-0': 'session2'
        },
        filters: [[{for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'session2'}]]
      },
      {
        raw: {
          sessionId: 'session3'
        },
        queryParams: map3,
        resultsQueryParams: {
          '0-root-1-0': 'session3'
        },
        queryTasksParams: {
          '0-root-1-0': 'session3'
        },
        filters: [[{for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'session3'}]]
      }
    ]);
  });

  it('should cache received data', () => {
    component.refresh$.next();
    expect(mockCacheService.get).toHaveBeenCalled();
  });

  it('should have an empty data if it cannot compute GrpcData', () => {
    jest.spyOn(component, 'computeGrpcData').mockReturnValue(undefined);
    component.refresh$.next();
    expect(component.data()).toEqual([]);
  });

  it('should prepare data before fetching', () => {
    component.displayedColumns.push({key: 'duration', name: 'Duration', sortable: true});
    component.options.sort.active = 'duration';
    component.filters = [];
    component.prepareBeforeFetching(component.options, component.filters);
    const date = new Date();
    date.setDate(date.getDate() - 3);
    expect(component.filters).toContainEqual([{
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
      for: 'root',
      operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
      value: Math.floor(date.getTime()/1000)
    }]);
  });

  describe('afterDataCreation', () => {
    beforeEach(() => {
      component.displayedColumns = [];
    });

    it('should update dataRaw if the duration is displayed', () => {
      component.displayedColumns.push({key: 'duration', name: 'Duration', sortable: true});
      component.afterDataCreation(sessionData.sessions);
      expect(component.dataRaw).toEqual(sessionData.sessions);
    });

    it('should call the nextStartDuration$ subject', () => {
      const spy = jest.spyOn(component.nextStartDuration$, 'next');
      component.displayedColumns.push({key: 'duration', name: 'Duration', sortable: true});
      component.afterDataCreation(sessionData.sessions);
      expect(spy).toHaveBeenCalledTimes(sessionData.sessions.length);
    });

    it('should call the nextEndDuration$ subject', () => {
      const spy = jest.spyOn(component.nextEndDuration$, 'next');
      component.displayedColumns.push({key: 'duration', name: 'Duration', sortable: true});
      component.afterDataCreation(sessionData.sessions);
      expect(spy).toHaveBeenCalledTimes(sessionData.sessions.length);
    });
  });

  describe('nextDuration piping', () => {
    const sessionId = 'sessionId';
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(component, 'durationSubscription');
    });

    it('should get the task start data', () => {
      component.nextStartDuration$.next(sessionId);
      expect(mockSessionsGrpcService.getTaskData$).toHaveBeenCalledWith(sessionId, 'createdAt', 'asc');
    });

    it('should get the task end data', () => {
      component.nextEndDuration$.next(sessionId);
      expect(mockSessionsGrpcService.getTaskData$).toHaveBeenCalledWith(sessionId, 'endedAt', 'desc');
    });

    it('should subscribe with createdAt', () => {
      mockSessionsGrpcService.getTaskData$.mockReturnValueOnce(of(taskCreatedAt));
      component.nextStartDuration$.next(sessionId);
      expect(spy).toHaveBeenCalledWith(taskCreatedAt, 'created');
    });

    it('should subscribe with endedAt', () => {
      mockSessionsGrpcService.getTaskData$.mockReturnValueOnce(of(taskEndedAt));
      component.nextEndDuration$.next(sessionId);
      expect(spy).toHaveBeenCalledWith(taskEndedAt, 'ended');
    });
  });

  it('should check if the duration is displayed', () => {
    component.displayedColumns = [];
    expect(component.isDurationDisplayed()).toBe(false);
    component.displayedColumns.push({key: 'duration', name: 'Duration', sortable: true});
    expect(component.isDurationDisplayed()).toBe(true);
  });

  describe('filterHadCreatedAt', () => {
    it('should return true if the filters contain a "createdAt" filter', () => {
      const filters: SessionRawFilters = [[{
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '123456'
      }]];
      expect(component.filterHasCreatedAt(filters)).toBe(true);
    });

    it('should return false if the filters does not contain a "createdAt" filter', () => {
      expect(component.filterHasCreatedAt([])).toBe(false);
    });
  });

  describe('orderByDuration', () => {
    const sessionsWithDuration: SessionRaw[] = [
      {
        sessionId: 'biggest',
        duration: {
          nanos: 0,
          seconds: '10000'
        }
      },
      {
        sessionId: 'smallest',
        duration: {
          nanos: 0,
          seconds: '1000'
        }
      },
      {
        sessionId: 'middle',
        duration: {
          nanos: 0,
          seconds: '5000'
        }
      }
    ] as SessionRaw[];

    it('should order ascendantly', () => {
      component.options.sort.direction = 'asc';
      component.orderByDuration(sessionsWithDuration);
      expect(component.data().map(d => d.raw.sessionId)).toEqual(['smallest', 'middle', 'biggest']);
    });

    it('should order descendently', () => {
      component.options.sort.direction = 'desc';
      component.orderByDuration(sessionsWithDuration);
      expect(component.data().map(d => d.raw.sessionId)).toEqual(['biggest', 'middle', 'smallest']);
    });

    it('should slice data to have a length equal to the page size', () => {
      component.options.sort.direction = 'asc';
      component.options.pageSize = 2;
      component.orderByDuration(sessionsWithDuration);
      expect(component.data().length).toEqual(2);
    });
  });

  describe('durationSubscription', () => {
    it('should push the end dates to the endedDates array', () => {
      component.durationSubscription(taskCreatedAt, 'created');
      expect(component.sessionCreationDates).toContainEqual(taskCreatedAt);
    });

    it('should push the starting dates to the creationDates array', () => {
      component.durationSubscription(taskEndedAt, 'ended');
      expect(component.sessionEndedDates).toContainEqual(taskEndedAt);
    });

    it('should call computeDuration', () => {
      const spy = jest.spyOn(component.computeDuration$, 'next');
      component.durationSubscription(taskCreatedAt, 'created');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('computationErrorNotification', () => {
    const sessionId = 'sessionId';
    beforeEach(() => {
      component.computationErrorNotification(sessionId);
    });

    it('should send a notification on computation error', () => {
      expect(mockNotificationService.warning).toHaveBeenCalledWith(`Error while computing duration for session: ${sessionId}`);
    });

    it('should send the notification only one time', () => {
      expect(mockNotificationService.warning).toHaveBeenCalledTimes(1);
    });
  });

  describe('compute duration', () => {
    it('should not compute if the ended and created array have not the same length as the dataRaw array', () => {
      component.loading.set(true); // We are mocking the fact that the component is loading
      component.computeDuration$.next();
      expect(component.loading()).toBeTruthy();
    });

    it('should compute the duration for a session', () => {
      component.isDurationSorted = false;
      component.dataRaw = [{sessionId: 'sessionId'}] as SessionRaw[];
      component.durationSubscription(taskCreatedAt, 'created');
      component.durationSubscription(taskEndedAt, 'ended');
      const selectedData = component.data().map(d => {
        return { sessionId: d.raw.sessionId, duration: d.raw.duration };
      });
      expect(selectedData).toEqual(
        [
          {
            sessionId: 'sessionId',
            duration: {
              seconds: (Number(taskEndedAt.date?.seconds) - Number(taskCreatedAt.date?.seconds)).toString(),
              nanos: 0
            }
          }
        ]
      );
    });

    it('should also order by duration', () => {
      component.isDurationSorted = true;
      const spy = jest.spyOn(component, 'orderByDuration');
      component.dataRaw = [{sessionId: 'sessionId'}] as SessionRaw[];
      component.durationSubscription(taskCreatedAt, 'created');
      component.durationSubscription(taskEndedAt, 'ended');
      expect(spy).toHaveBeenCalled();
    });
    
    it('should log error if there is a computation error', () => {
      const spy = jest.spyOn(component, 'computationErrorNotification');
      component.dataRaw = [{sessionId: 'sessionId'}] as SessionRaw[];
      component.durationSubscription({sessionId: 'otherSession', date: {seconds: '10', nanos: 0} as Timestamp}, 'created');
      component.durationSubscription(taskEndedAt, 'ended');
      expect(spy).toHaveBeenCalledWith('sessionId');
    });
  });

  describe('on list error', () => {
    beforeEach(() => {
      mockSessionsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
    });

    it('should log error', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      component.refresh$.next();
      expect(spy).toHaveBeenCalled();
    });

    it('should send a notification', () => {
      component.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should send empty data', () => {
      component.refresh$.next();
      expect(component.data()).toEqual([]);
    });
  });

  it('should refresh data on options changes', () => {
    const spy = jest.spyOn(component.refresh$, 'next');
    component.onOptionsChange();
    expect(spy).toHaveBeenCalled();
  });

  describe('on Pause', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(component.refresh$, 'next');
      component.onPause('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.pause$.mockReturnValueOnce(throwError(() => new Error()));
      component.onPause('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to pause session');
    });
  });

  describe('on Resume', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(component.refresh$, 'next');
      component.onResume('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.resume$.mockReturnValueOnce(throwError(() => new Error()));
      component.onResume('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to resume session');
    });
  });

  describe('on Cancel', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(component.refresh$, 'next');
      component.onCancel('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      component.onCancel('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to cancel session');
    });
  });

  describe('on Close', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(component.refresh$, 'next');
      component.onClose('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.close$.mockReturnValueOnce(throwError(() => new Error()));
      component.onClose('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to close session');
    });
  });

  describe('on Delete', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(component.refresh$, 'next');
      component.onDelete('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.delete$.mockReturnValueOnce(throwError(() => new Error()));
      component.onDelete('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to delete session');
    });
  });

  it('should send a notification on copy', () => {
    component.onCopiedSessionId({
      raw: {
        sessionId: 'sessionId'
      }
    } as unknown as SessionData);
    expect(mockClipBoard.copy).toHaveBeenCalledWith('sessionId');
    expect(mockNotificationService.success).toHaveBeenCalledWith('Session ID copied to clipboard');
  });

  test('onDrop should call sessionsIndexService', () => {
    const newColumns: SessionRawColumnKey[] = ['actions', 'sessionId', 'status'];
    component.onDrop(newColumns);
    expect(mockSessionsIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  describe('personnalizeTasksByStatus', () => {
    beforeEach(() => {
      component.personalizeTasksByStatus();
    });

    it('should update statusesGroups', () => {
      expect(component.statusesGroups).toEqual([...mockDialogReturn.groups]);
    });

    it('should call tasksByStatus service',() => {
      expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith(component.table, component.statusesGroups);
    });
  });

  describe('actions', () => {

    const sessionData = {
      raw: {
        sessionId: 'sessionId',
        status: SessionStatus.SESSION_STATUS_RUNNING
      },
      resultsQueryParams: {
        '0-root-1-0': 'sessionId'
      }
    } as unknown as SessionData;

    it('should copy', () => {
      const spy = jest.spyOn(component, 'onCopiedSessionId');
      const action = component.actions[0];
      action.action$.next(sessionData);
      expect(spy).toHaveBeenCalledWith(sessionData);
    });

    it('should permit to see session', () => {
      const spy = jest.spyOn(component.router, 'navigate');
      const action = component.actions[1];
      action.action$.next(sessionData);
      expect(spy).toHaveBeenCalledWith(['/sessions', sessionData.raw.sessionId]);
    });

    it('should permit to see results', () => {
      const spy = jest.spyOn(component.router, 'navigate');
      const action = component.actions[2];
      action.action$.next(sessionData);
      expect(spy).toHaveBeenCalledWith(['/results'], { queryParams: sessionData.resultsQueryParams });
    });

    it('should check if a session can be paused', () => {
      const action = component.actions[3];
      if (action.condition) {
        expect(action.condition(sessionData)).toBe(true);
      }
    });

    it('should pause a session', () => {
      const action = component.actions[3];
      action.action$.next(sessionData);
      expect(mockSessionsGrpcService.pause$).toHaveBeenCalledWith(sessionData.raw.sessionId);
    });

    it('should check if a session can be resumed', () => {
      const action = component.actions[4];
      if (action.condition) {
        expect(action.condition(sessionData)).toBe(false);
      }
    });

    it('should resume a session', () => {
      const action = component.actions[4];
      action.action$.next(sessionData);
      expect(mockSessionsGrpcService.resume$).toHaveBeenCalledWith(sessionData.raw.sessionId);
    });

    it('should check if a session can be cancelled', () => {
      const action = component.actions[5];
      if (action.condition) {
        expect(action.condition(sessionData)).toBe(true);
      }
    });

    it('should cancel a session', () => {
      const action = component.actions[5];
      action.action$.next(sessionData);
      expect(mockSessionsGrpcService.cancel$).toHaveBeenCalledWith(sessionData.raw.sessionId);
    });

    it('should check if a session can be closed', () => {
      const action = component.actions[6];
      if (action.condition) {
        expect(action.condition(sessionData)).toBe(true);
      }
    });

    it('should close a session', () => {
      const action = component.actions[6];
      action.action$.next(sessionData);
      expect(mockSessionsGrpcService.close$).toHaveBeenCalledWith(sessionData.raw.sessionId);
    });

    it('should check if a session can be deleted', () => {
      const action = component.actions[7];
      if (action.condition) {
        expect(action.condition(sessionData)).toBe(true);
      }
    });

    it('should delete a session', () => {
      const action = component.actions[7];
      action.action$.next(sessionData);
      expect(mockSessionsGrpcService.delete$).toHaveBeenCalledWith(sessionData.raw.sessionId);
    });
  });

  describe('isDataRawEqual', () => {
    it('should return true if two sessionRaws are the same', () => {
      const session1 = { sessionId: 'session' } as SessionRaw;
      const session2 = {...session1} as SessionRaw;
      expect(component.isDataRawEqual(session1, session2)).toBeTruthy();
    });

    it('should return false if two sessionRaws are differents', () => {
      const session1 = { sessionId: 'session' } as SessionRaw;
      const session2 = { sessionId: 'session1' } as SessionRaw;
      expect(component.isDataRawEqual(session1, session2)).toBeFalsy();
    });
  });
});