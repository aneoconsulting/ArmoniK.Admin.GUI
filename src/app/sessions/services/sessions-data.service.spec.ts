import { FilterDateOperator, FilterNumberOperator, FilterStringOperator, ListSessionsResponse, SessionRawEnumField, SessionTaskOptionEnumField, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { TaskOptions } from '@app/tasks/types';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { of, throwError } from 'rxjs';
import { SessionsGrpcService } from './sessions-grpc.service';
import { SessionRaw } from '../types';
import { SessionsDataService } from './sessions-data.service';

describe('SessionsDataService', () => {
  let service: SessionsDataService;

  const cachedSessions = { sessions: [{ sessionId: 'session1' }, { sessionId: 'session2', }], total: 2 } as unknown as ListSessionsResponse;
  const mockCacheService = {
    get: jest.fn(() => cachedSessions),
    save: jest.fn(),
  };

  const sessions = { sessions: [{ sessionId: 'session1' }, { sessionId: 'session2' }, { sessionId: 'session3' }] as SessionRaw[], total: 3 } as unknown as ListSessionsResponse;
  let index = 0;
  const mockSessionsGrpcService = {
    list$: jest.fn(() => of(sessions)),
    getTaskData$: jest.fn((id, type) => {
      if (type === 'createdAt') {
        return of({
          sessionId: id,
          date: (index !== 2 ? {seconds: 1620000000, nanos: 0} : undefined)
        });
      } else {
        index++;
        return of({
          sessionId: id,
          date: {seconds: (1620000000+index*1000).toString(), nanos: 0}
        });
      }
    }),
    cancel$: jest.fn(() => of({})),
    pause$: jest.fn(() => of({})),
    resume$: jest.fn(() => of({})),
    close$: jest.fn(() => of({})),
    delete$: jest.fn(() => of({})),
    purge$: jest.fn(() => of({})),
  };

  const mockNotificationService = {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  const initialOptions: ListOptions<SessionRaw, TaskOptions> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'sessionId',
      direction: 'desc'
    }
  };

  const initialFilters: FiltersOr<SessionRawEnumField, TaskOptionEnumField> = [];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        SessionsDataService,
        FiltersService,
        { provide: SessionsGrpcService, useValue: mockSessionsGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: CacheService, useValue: mockCacheService },
      ]
    }).inject(SessionsDataService);
    service.options = initialOptions;
    service.filters = initialFilters;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should load data from the cache', () => {
      const map1 = new Map();
      const map2 = new Map();
      map1.set('sessionId', {'0-root-1-0': 'session1'});
      map2.set('sessionId', {'0-root-1-0': 'session2'});
      expect(service.data).toEqual([
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

    it('should set the total cached data', () => {
      expect(service.total).toEqual(cachedSessions.total);
    });
  });

  describe('Fetching data', () => {
    it('should list the data', () => {
      service.refresh$.next();
      expect(mockSessionsGrpcService.list$).toHaveBeenCalledWith(service.options, service.filters);
    });
    
    it('should update the total', () => {
      service.refresh$.next();
      expect(service.total).toEqual(sessions.total);
    });

    it('should update the data', () => {
      service.filters = [
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
          {
            for: 'options',
            field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES,
            operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN,
            value: 1
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
            for: 'root',
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
            value: 'id'
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
      const map1 = new Map();
      const map2 = new Map();
      const map3 = new Map();
      map1.set('sessionId', {'0-root-1-0': 'session1'});
      map2.set('sessionId', {'0-root-1-0': 'session2'});
      map3.set('sessionId', {'0-root-1-0': 'session3'});
      service.refresh$.next();
      expect(service.data).toEqual([
        {
          raw: {
            sessionId: 'session1'
          },
          queryParams: map1,
          resultsQueryParams: {
            '0-root-1-2': 'session1',
            '0-root-1-0': 'session1',
            '1-root-1-4': 'session2',
            '1-root-1-0': 'session1',
            '1-root-1-2': 'id',
          },
          queryTasksParams: {
            '0-root-1-2': 'session1',
            '0-root-1-0': 'session1',
            '0-options-2-5': '1',
            '1-root-1-0': 'session1',
            '1-root-1-2': 'id',
            '1-root-1-4': 'session2',
          },
          filters: [[{for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'session1'}]]
        },
        {
          raw: {
            sessionId: 'session2'
          },
          queryParams: map2,
          resultsQueryParams: {
            '0-root-1-2': 'session1',
            '0-root-1-0': 'session2',
            '1-root-1-4': 'session2',
            '1-root-1-0': 'session2',
            '1-root-1-2': 'id',
          },
          queryTasksParams: {
            '0-root-1-2': 'session1',
            '0-root-1-0': 'session2',
            '0-options-2-5': '1',
            '1-root-1-0': 'session2',
            '1-root-1-2': 'id',
            '1-root-1-4': 'session2',
          },
          filters: [[{for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'session2'}]]
        },
        {
          raw: {
            sessionId: 'session3'
          },
          queryParams: map3,
          resultsQueryParams: {
            '0-root-1-2': 'session1',
            '0-root-1-0': 'session3',
            '1-root-1-4': 'session2',
            '1-root-1-0': 'session3',
            '1-root-1-2': 'id',
          },
          queryTasksParams: {
            '0-root-1-0': 'session3',
            '0-options-2-5': '1',
            '1-root-1-0': 'session3',
            '1-root-1-2': 'id',
            '1-root-1-4': 'session2',
            '0-root-1-2': 'session1',
          },
          filters: [[{for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'session3'}]]
        }
      ]);
    });

    it('should handle an empty DataRaw', () => {
      const sessions = { sessions: undefined, total: 0} as unknown as ListSessionsResponse;
      mockSessionsGrpcService.list$.mockReturnValueOnce(of(sessions));
      service.refresh$.next();
      expect(service.data).toEqual([]);
    });

    it('should catch errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should notify errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should cache the raw data', () => {
      service.refresh$.next();
      expect(mockCacheService.save).toHaveBeenCalledWith(service.scope, sessions);
    });
  });

  it('should display a success message', () => {
    const message = 'A success message !';
    service.success(message);
    expect(mockNotificationService.success).toHaveBeenCalledWith(message);
  });

  it('should display a warning message', () => {
    const message = 'A warning message !';
    service.warning(message);
    expect(mockNotificationService.warning).toHaveBeenCalledWith(message);
  });

  it('should display an error message', () => {
    const error: GrpcStatusEvent = {
      statusMessage: 'A error status message'
    } as GrpcStatusEvent;
    jest.spyOn(console, 'error').mockImplementation(() => {});
    service.error(error);
    expect(mockNotificationService.error).toHaveBeenCalledWith(error.statusMessage);
  });

  it('should load correctly', () => {
    expect(service.loading).toBeFalsy();
  });

  describe('computing duration', () => {
    beforeEach(() => {
      service.isDurationDisplayed = true;
    });

    it('should compute the duration for each session', () => {
      service.refresh$.next();
      expect(service.data.map((session) => ({sessionId: session.raw.sessionId, duration: session.raw.duration}))).toEqual([
        {
          sessionId: 'session1',
          duration: {
            seconds: '1000',
            nanos: 0,
          }
        },
        {
          sessionId: 'session2',
          duration: {
            seconds: '2000',
            nanos: 0,
          }
        },
        {
          sessionId: 'session3',
          duration: undefined,
        },
      ]);
    });

    it('should warn if there were a notification error', () => {
      index = 0;
      service.refresh$.next();
      expect(mockNotificationService.warning).toHaveBeenCalledTimes(1);
    });

    it('should sort in an ascending order', () => {
      index = 3;
      service.filters = [
        [
          {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
            for: 'root',
            operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER,
            value: 1,
          }
        ]
      ];
      service.options.sort = {
        active: 'duration',
        direction: 'asc',
      };
      service.refresh$.next();
      expect(service.data.map(session => session.raw.sessionId)).toEqual(['session1', 'session2', 'session3']);
    });

    it('should sort in a descending order', () => {
      index = 3;
      service.options.sort = {
        active: 'duration',
        direction: 'desc',
      };
      service.refresh$.next();
      expect(service.data.map(session => session.raw.sessionId)).toEqual(['session3', 'session2', 'session1']);
    });
  });

  describe('on Pause', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(service.refresh$, 'next');
      service.onPause('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.pause$.mockReturnValueOnce(throwError(() => new Error()));
      service.onPause('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to pause session');
    });
  });

  describe('on Resume', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(service.refresh$, 'next');
      service.onResume('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.resume$.mockReturnValueOnce(throwError(() => new Error()));
      service.onResume('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to resume session');
    });
  });

  describe('on purge', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(service.refresh$, 'next');
      service.onPurge('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.purge$.mockReturnValueOnce(throwError(() => new Error()));
      service.onPurge('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to purge session');
    });
  });

  describe('on Cancel', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(service.refresh$, 'next');
      service.onCancel('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      service.onCancel('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to cancel session');
    });
  });

  describe('on Close', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(service.refresh$, 'next');
      service.onClose('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.close$.mockReturnValueOnce(throwError(() => new Error()));
      service.onClose('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to close session');
    });
  });

  describe('on Delete', () => {
    it('should refresh on success', () => {
      const spy = jest.spyOn(service.refresh$, 'next');
      service.onDelete('sessionId');
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      mockSessionsGrpcService.delete$.mockReturnValueOnce(throwError(() => new Error()));
      service.onDelete('sessionId');
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to delete session');
    });
  });
});