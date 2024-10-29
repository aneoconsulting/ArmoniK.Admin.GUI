import { TaskSummaryEnumField, FilterStringOperator, ListTasksResponse, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { of, throwError } from 'rxjs';
import TasksDataService from './tasks-data.service';
import { TaskOptions, TaskSummary } from '../types';
import { TasksGrpcService } from './tasks-grpc.service';

describe('TasksDataService', () => {
  let service: TasksDataService;

  const cachedTasks = { tasks: [{ id: 'task1' }, { id: 'task2' }], total: 2 } as unknown as ListTasksResponse;
  const mockCacheService = {
    get: jest.fn(() => cachedTasks),
    save: jest.fn(),
  };

  const tasks = { tasks: [{ id: 'task1' }, { id: 'task2' }, { id: 'task3' }], total: 3 }  as unknown as ListTasksResponse;
  const mockTasksGrpcService = {
    list$: jest.fn(() => of(tasks)),
    cancel$: jest.fn(() => of({})),
  };

  const mockNotificationService = {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  const initialOptions: ListOptions<TaskSummary, TaskOptions> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'id',
      direction: 'desc'
    }
  };

  const initialFilters: FiltersOr<TaskSummaryEnumField, TaskOptionEnumField> = [];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksDataService,
        FiltersService,
        { provide: TasksGrpcService, useValue: mockTasksGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: CacheService, useValue: mockCacheService },
      ]
    }).inject(TasksDataService);
    service.options = initialOptions;
    service.filters = initialFilters;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should load data from the cache', () => {
      expect(service.data).toEqual([
        {
          raw: {
            id: 'task1'
          },
          resultsQueryParams: {
            '1-root-3-0': 'task1'
          }
        },
        {
          raw: {
            id: 'task2'
          },
          resultsQueryParams: {
            '1-root-3-0': 'task2'
          }
        },
      ]);
    });

    it('should set the total cached data', () => {
      expect(service.total).toEqual(cachedTasks.total);
    });
  });

  describe('Fetching data', () => {
    it('should list the data', () => {
      service.refresh$.next();
      expect(mockTasksGrpcService.list$).toHaveBeenCalledWith(service.options, service.filters);
    });

    it('should update the total', () => {
      service.refresh$.next();
      expect(service.total).toEqual(tasks.total);
    });

    it('should update the data', () => {
      service.refresh$.next();
      expect(service.data).toEqual([
        {
          raw: {
            id: 'task1'
          },
          resultsQueryParams: {
            '1-root-3-0': 'task1'
          }
        },
        {
          raw: {
            id: 'task2'
          },
          resultsQueryParams: {
            '1-root-3-0': 'task2'
          }
        },
        {
          raw: {
            id: 'task3'
          },
          resultsQueryParams: {
            '1-root-3-0': 'task3'
          }
        }
      ]);
    });

    it('should handle an empty DataSummary', () => {
      const emptyTasks = { tasks: undefined, total: 0 } as unknown as ListTasksResponse;
      mockTasksGrpcService.list$.mockReturnValueOnce(of(emptyTasks));
      service.refresh$.next();
      expect(service.data).toEqual([]);
    });

    it('should catch errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockTasksGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should notify errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockTasksGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should cache the summary data', () => {
      service.refresh$.next();
      expect(mockCacheService.save).toHaveBeenCalledWith(service.scope, tasks);
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

  describe('Applying filters', () => {
    const filters: FiltersOr<TaskSummaryEnumField, TaskOptionEnumField> = [
      [
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
          value: 'session1'
        },
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
          value: 'taskId'
        }
      ],
      [
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: 'should not appear'
        },
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
          value: 'session2'
        },
        {
          field: null,
          for: 'root',
          operator: null,
          value: 'neither should this'
        }
      ]
    ];

    it('should apply the filters correctly when transforming the data', () => {
      service.filters = filters;
      service.refresh$.next();
      expect(service.data).toEqual([
        {
          raw: {
            id: 'task1'
          },
          resultsQueryParams: {
            '0-root-1-2': 'session1',
            '0-root-3-1': 'taskId',
            '0-root-3-0': 'task1',
            '1-root-1-4': 'session2',
            '1-root-3-0': 'task1',
          }
        },
        {
          raw: {
            id: 'task2'
          },
          resultsQueryParams: {
            '0-root-1-2': 'session1',
            '0-root-3-1': 'taskId',
            '0-root-3-0': 'task2',
            '1-root-1-4': 'session2',
            '1-root-3-0': 'task2',
          }
        },
        {
          raw: {
            id: 'task3'
          },
          resultsQueryParams: {
            '0-root-1-2': 'session1',
            '0-root-3-1': 'taskId',
            '0-root-3-0': 'task3',
            '1-root-1-4': 'session2',
            '1-root-3-0': 'task3',
          }
        }
      ]);
    });
  });

  describe('Cancel tasks', () => {
    const tasksToCancel = ['1', '2', '3'];

    it('should cancel tasks', () => {
      service.cancelTasks(tasksToCancel);
      expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith(tasksToCancel);
    });

    it('should display a success message', () => {
      service.cancelTasks(tasksToCancel);
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it('should log errors', () => {
      mockTasksGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      service.cancelTasks(tasksToCancel);
      expect(spy).toHaveBeenCalled();
    });

    it('should display an error message', () => {
      mockTasksGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      jest.spyOn(console, 'error').mockImplementation(() => {});
      service.cancelTasks(tasksToCancel);
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  it('should cancel one task', () => {
    const task = '1';
    service.cancelTask(task);
    expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith([task]);
  });
});