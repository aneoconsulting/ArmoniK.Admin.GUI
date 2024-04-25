import { FilterStringOperator, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { TaskData } from '@app/types/data';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { TasksTableComponent } from './table.component';
import { TasksGrpcService } from '../services/tasks-grpc.service';
import { TasksIndexService } from '../services/tasks-index.service';
import { TasksStatusesService } from '../services/tasks-statuses.service';
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryFilters } from '../types';

describe('TasksTableComponent', () => {
  let component: TasksTableComponent;

  const displayedColumns: TableColumn<TaskSummaryColumnKey>[] = [
    {
      name: 'Task ID',
      key: 'id',
      type: 'link',
      sortable: true,
      link: '/tasks',
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

  const mockTasksIndexService = {
    isActionsColumn: jest.fn(),
    isTaskIdColumn: jest.fn(),
    isStatusColumn: jest.fn(),
    isDateColumn: jest.fn(),
    isDurationColumn: jest.fn(),
    isObjectColumn: jest.fn(),
    isSelectColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn(),
    columnToLabel: jest.fn(),
    saveColumns: jest.fn()
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const mockTasksGrpcService = {
    list$: jest.fn(() => of({ tasks: [{ id: 'task1' }, { id: 'task2' }, { id: 'task3' }], total: 3 })),
    cancel$: jest.fn(() => of({})),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TasksTableComponent,
        { provide: TasksIndexService, useValue: mockTasksIndexService },
        { provide: TasksGrpcService, useValue: mockTasksGrpcService },
        TasksStatusesService,
        FiltersService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
      ]
    }).inject(TasksTableComponent);

    component.displayedColumns = displayedColumns;
    component.selection = [];
    component.filters$ = new BehaviorSubject<TaskSummaryFilters>([]);
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'id',
        direction: 'desc'
      }
    };
    component.refresh$ = new Subject();
    component.loading$ = new Subject();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should update data on refresh', () => {
    component.refresh$.next();
    expect(component.data).toEqual([
      {
        raw: {
          id: 'task1'
        },
        resultsQueryParams: {
          '1-root-3-0': 'task1'
        },
        value$: expect.any(Subject)
      },
      {
        raw: {
          id: 'task2'
        },
        resultsQueryParams: {
          '1-root-3-0': 'task2'
        },
        value$: expect.any(Subject)
      },
      {
        raw: {
          id: 'task3'
        },
        resultsQueryParams: {
          '1-root-3-0': 'task3'
        },
        value$: expect.any(Subject)
      }
    ]);
  });

  it('should return columns keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(column => column.key));
  });

  describe('on list error', () => {
    beforeEach(() => {
      mockTasksGrpcService.list$.mockImplementationOnce(() => {
        return throwError(() => new Error());
      });
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
      expect(component.data).toEqual([]);
    });
  });

  it('should refresh data on options changes', () => {
    const spy = jest.spyOn(component.refresh$, 'next');
    component.onOptionsChange();
    expect(spy).toHaveBeenCalled();
  });

  it('should check if the task is retried', () => {
    const task: TaskSummary = {
      status: TaskStatus.TASK_STATUS_RETRIED
    } as unknown as TaskSummary;
    expect(component.isRetried(task)).toBeTruthy();
  });

  it('should send a notification on copy', () => {
    component.onCopiedTaskId({
      raw: {
        id: 'taskId'
      }
    } as unknown as TaskData);
    expect(mockClipBoard.copy).toHaveBeenCalledWith('taskId');
    expect(mockNotificationService.success).toHaveBeenCalledWith('Task ID copied to clipboard');
  });

  it('should emit on task retries', () => {
    const spy = jest.spyOn(component.retries, 'emit');
    const task = {} as unknown as TaskSummary;
    component.onRetries(task);
    expect(spy).toHaveBeenCalledWith(task);
  });

  it('should emit on cancel task', () => {
    const id = 'taskId';
    component.onCancelTask(id);
    expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith([id]);
  });

  it('should check if task can be cancelled', () => {
    const task: TaskSummary = {
      status: TaskStatus.TASK_STATUS_PROCESSING
    } as unknown as TaskSummary;
    expect(component.canCancelTask(task)).toBeTruthy();
  });

  describe('generateViewInLogsUrl', () => {
    it('should return an empty string if there is no urlTemplate', () => {
      component.urlTemplate = null;
      expect(component.generateViewInLogsUrl('taskId')).toEqual('');
    });

    it('should return something if the urlTemplate is present', () => {
      component.urlTemplate = 'myUrl?taskId=%taskId';
      expect(component.generateViewInLogsUrl('myUniqueId')).toEqual('myUrl?taskId=myUniqueId');
    });
  });

  test('onDrop should call tasksIndexService', () => {
    const newColumns: TaskSummaryColumnKey[] = ['actions', 'id', 'status'];
    component.onDrop(newColumns);
    expect(mockTasksIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  it('should emit on selection change', () => {
    const spy = jest.spyOn(component.selectionChange, 'emit');
    component.onSelectionChange([{ id: 'taskId1' }, { id: 'taskId2' }] as unknown as TaskSummary[]);
    expect(spy).toHaveBeenCalledWith(['taskId1', 'taskId2']);
  });

  describe('Adding a service', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(component, 'addService');
      component.serviceIcon = 'icon';
      component.serviceName = 'service';
      component.urlTemplate = 'template';
    });

    it('should set urlTemplate', () => {
      expect(component.urlTemplate).toEqual('template');
    });

    it('should set serviceName', () => {
      expect(component.serviceName).toEqual('service');
    });

    it('should set serviceIcon', () => {
      expect(component.serviceIcon).toEqual('icon');
    });

    it('should call addService', () => {
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should add a service action', () => {
      expect(component.actions[4]).toEqual({
        label: 'service',
        icon: 'icon',
        action$: component.openViewInLogs$
      });
    });

    it('should modify the service action', () => {
      component.serviceIcon = 'newIcon';
      expect(component.actions[4]).toEqual({
        label: 'service',
        icon: 'newIcon',
        action$: component.openViewInLogs$
      });
    });
  });

  describe('Results query params', () => {
    const id = 'taskId';
    it('should return the taskId if there is no filter', () => {
      expect(component.createResultsQueryParams(id)).toEqual({
        '1-root-3-0': id
      });
    });

    it('should add filters if there is any', () => {
      component.filters = [
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
      expect(component.createResultsQueryParams(id)).toEqual({
        '0-root-1-2': 'session1',
        '0-root-3-1': 'taskId',
        '0-root-3-0': id,
        '1-root-1-4': 'session2',
        '1-root-3-0': id,
      });
    });
  });

  describe('actions', () => {
    const task = {
      raw: {
        id: 'taskId',
        status: TaskStatus.TASK_STATUS_COMPLETED
      }
    } as unknown as TaskData;

    it('should copy the task id', () => {
      component.actions[0].action$.next(task);
      expect(mockClipBoard.copy).toHaveBeenCalledWith(task.raw.id);
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it('should permit to see task related results', () => {
      const spy = jest.spyOn(component.router, 'navigate');
      component.actions[1].action$.next(task);
      expect(spy).toHaveBeenCalled();
    });

    it('should permit to retry the task', () => {
      const spy = jest.spyOn(component.retries, 'emit');
      component.actions[2].action$.next(task);
      expect(spy).toHaveBeenCalledWith(task.raw);
    });

    it('should not permit to retry if the tasks cannot be retried', () => {
      if (component.actions[2].condition) {
        task.raw.status = TaskStatus.TASK_STATUS_COMPLETED;
        expect(component.actions[2].condition(task)).toBeFalsy();
      }
    });

    it('should permit to cancel task', () => {
      component.actions[3].action$.next(task);
      expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith([task.raw.id]);
    });

    it('should not permit to cancel tasks if the task is not cancellable', () => {
      if (component.actions[3].condition) {
        expect(component.actions[3].condition(task)).toBeFalsy();
      }
    });

    it('should open views in logs', () => {
      const spy = jest.spyOn(window, 'open');
      component.serviceIcon = 'icon';
      component.serviceName = 'service';
      component.urlTemplate = 'https://myurl.com?taskId=%taskId';
      component.actions[4].action$.next(task);
      expect(spy).toHaveBeenCalledWith(`https://myurl.com?taskId=${task.raw.id}`, '_blank');
    });
  });
});