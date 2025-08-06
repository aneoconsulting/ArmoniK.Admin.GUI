import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GrpcAction } from '@app/types/actions.type';
import { TableColumn } from '@app/types/column.type';
import { ArmonikData, ColumnKey, TaskData } from '@app/types/data';
import { StatusService } from '@app/types/status';
import { NotificationService } from '@services/notification.service';
import { TasksTableComponent } from './table.component';
import TasksDataService from '../services/tasks-data.service';
import { TasksGrpcActionsService } from '../services/tasks-grpc-actions.service';
import { TaskOptions, TaskSummary } from '../types';

function getAction(actions: GrpcAction<TaskSummary>[], label: string) {
  return actions.filter(action => action.label === label)[0];
} 

describe('TasksTableComponent', () => {
  let component: TasksTableComponent;

  const displayedColumns: TableColumn<TaskSummary, TaskOptions>[] = [
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

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const mockTasksDataService = {
    data: signal([] as ArmonikData<TaskSummary, TaskOptions>[]),
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
    cancelTask: jest.fn(),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockStatusService = {
    statuses: {
      [TaskStatus.TASK_STATUS_CANCELLED]: {
        label: 'Cancelled',
      },
      [TaskStatus.TASK_STATUS_COMPLETED]: {
        label: 'Completed'
      },
    },
    isRetried: jest.fn((s: TaskStatus) => s === TaskStatus.TASK_STATUS_RETRIED),
    taskNotEnded: jest.fn((s: TaskStatus) => s !== TaskStatus.TASK_STATUS_COMPLETED)
  };

  const mockGrpcService = {
    actions: [],
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TasksTableComponent,
        { provide: StatusService, useValue: mockStatusService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: Router, useValue: mockRouter },
        { provide: TasksDataService, useValue: mockTasksDataService },
        { provide: TasksGrpcActionsService, useValue: mockGrpcService },
      ]
    }).inject(TasksTableComponent);

    component.displayedColumns = displayedColumns;
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should return columns keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(column => column.key));
  });
  
  describe('options changes', () => {
    it('emit', () => {
      const spy = jest.spyOn(component.optionsUpdate, 'emit');
      component.onOptionsChange();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should check if the task is retried', () => {
    const task: TaskSummary = {
      status: TaskStatus.TASK_STATUS_RETRIED
    } as unknown as TaskSummary;
    expect(component.isRetried(task)).toBeTruthy();
  });

  it('should send a notification on copy', () => {
    component.onCopiedTaskId({
      id: 'taskId'
    } as TaskSummary);
    expect(mockClipBoard.copy).toHaveBeenCalledWith('taskId');
    expect(mockNotificationService.success).toHaveBeenCalledWith('Task ID copied to clipboard');
  });

  it('should emit on task retries', () => {
    const spy = jest.spyOn(component.retries, 'emit');
    const task = {} as unknown as TaskSummary;
    component.onRetries(task);
    expect(spy).toHaveBeenCalledWith(task);
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

  test('onDrop should emit', () => {
    const spy = jest.spyOn(component.columnUpdate, 'emit');
    const newColumns: ColumnKey<TaskSummary, TaskOptions>[] = ['actions', 'id', 'status'];
    component.onDrop(newColumns);
    expect(spy).toHaveBeenCalledWith(newColumns);
  });

  it('should emit on selection change', () => {
    const spy = jest.spyOn(component.selectionChange, 'emit');
    const event = [{ id: 'taskId1' }, { id: 'taskId2' }] as unknown as TaskSummary[];
    component.onSelectionChange(event);
    expect(spy).toHaveBeenCalledWith(event);
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
      const action = getAction(component.actions, component.serviceName);
      expect(action).toEqual({
        label: 'service',
        icon: 'icon',
        click: action.click
      });
    });

    it('should modify the service action', () => {
      const mockAction = {
        label: 'service',
        icon: 'icon',
        click: jest.fn()
      };
      component.actions[4] = mockAction;
      component.serviceIcon = 'newIcon';
      expect(component.actions[4]).toEqual({
        label: 'service',
        icon: 'newIcon',
        click: mockAction.click,
      });
    });
  });

  describe('actions', () => {
    const task = {
      id: 'taskId',
      status: TaskStatus.TASK_STATUS_COMPLETED
    } as TaskSummary;

    it('should copy the task id', () => {
      const action = getAction(component.actions, 'Copy Task ID');
      action.click([task]);
      expect(mockClipBoard.copy).toHaveBeenCalledWith(task.id);
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it('should permit to see task related results', () => {
      const mockTaskData = {
        raw: task,
        resultsQueryParams: {
          '0-root-3-0': task.id,
        }
      } as unknown as TaskData;
      mockTasksDataService.data.set([mockTaskData]);
      const action = getAction(component.actions, 'See related result');
      const spy = jest.spyOn(component.router, 'navigate');
      action.click([task]);
      expect(spy).toHaveBeenCalled();
    });

    describe('task retry', () => {
      let action: GrpcAction<TaskSummary>;      

      beforeEach(() => {
        action = getAction(component.actions, 'Retries');
      });

      it('should permit to retry the task', () => {
        const spy = jest.spyOn(component.retries, 'emit');
        action.click([task]);
        expect(spy).toHaveBeenCalledWith(task);
      });

      it('should not permit to retry if the tasks cannot be retried', () => {
        task.status = TaskStatus.TASK_STATUS_COMPLETED;
        expect(action.condition!([task])).toBeFalsy();
      });
    });

    it('should open views in logs', () => {
      const spy = jest.spyOn(window, 'open').mockImplementation(() => null);
      component.serviceIcon = 'icon';
      component.serviceName = 'service';
      component.urlTemplate = 'https://myurl.com?taskId=%taskId';
      const action = getAction(component.actions, component.serviceName);
      action.click([task]);
      expect(spy).toHaveBeenCalledWith(`https://myurl.com?taskId=${task.id}`, '_blank');
    });
  });

  describe('isDataRawEqual', () => {
    it('should return true if two taskSummaries are the same', () => {
      const task1 = { id: 'task' } as TaskSummary;
      const task2 = {...task1} as TaskSummary;
      expect(component.isDataRawEqual(task1, task2)).toBeTruthy();
    });

    it('should return false if two taskSummaries are differents', () => {
      const task1 = { id: 'task' } as TaskSummary;
      const task2 = { id: 'task1' } as TaskSummary;
      expect(component.isDataRawEqual(task1, task2)).toBeFalsy();
    });
  });

  it('should track a task by its id', () => {
    const task = { raw: { id: 'task' } } as TaskData;
    expect(component.trackBy(0, task)).toEqual(task.raw.id);
  });

  it('should get data', () => {
    expect(component.data).toEqual(mockTasksDataService.data);
  });

  it('should get total', () => {
    expect(component.total).toEqual(mockTasksDataService.total);
  });

  it('should get options', () => {
    expect(component.options).toEqual(mockTasksDataService.options);
  });

  it('should get filters', () => {
    expect(component.filters).toEqual(mockTasksDataService.filters);
  });

  it('should get column keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(c => c.key));
  });

  it('should get displayedColumns', () => {
    expect(component.columns).toEqual(displayedColumns);
  });
});