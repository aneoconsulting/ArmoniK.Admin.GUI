import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { TableColumn } from '@app/types/column.type';
import { ArmonikData, ColumnKey, TaskData } from '@app/types/data';
import { NotificationService } from '@services/notification.service';
import { TasksTableComponent } from './table.component';
import TasksDataService from '../services/tasks-data.service';
import { TasksStatusesService } from '../services/tasks-statuses.service';
import { TaskOptions, TaskSummary } from '../types';

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
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
    cancelTask: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TasksTableComponent,
        TasksStatusesService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: TasksDataService, useValue: mockTasksDataService }
      ]
    }).inject(TasksTableComponent);

    component.displayedColumns = displayedColumns;
    component.selection = [];
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
      raw: {
        id: 'taskId'
      }
    } as ArmonikData<TaskSummary, TaskOptions>);
    expect(mockClipBoard.copy).toHaveBeenCalledWith('taskId');
    expect(mockNotificationService.success).toHaveBeenCalledWith('Task ID copied to clipboard');
  });

  it('should emit on task retries', () => {
    const spy = jest.spyOn(component.retries, 'emit');
    const task = {} as unknown as TaskSummary;
    component.onRetries(task);
    expect(spy).toHaveBeenCalledWith(task);
  });

  it('should call the cancelTask method on cancel', () => {
    const id = 'taskId';
    component.onCancelTask(id);
    expect(mockTasksDataService.cancelTask).toHaveBeenCalledWith(id);
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

  test('onDrop should emit', () => {
    const spy = jest.spyOn(component.columnUpdate, 'emit');
    const newColumns: ColumnKey<TaskSummary, TaskOptions>[] = ['actions', 'id', 'status'];
    component.onDrop(newColumns);
    expect(spy).toHaveBeenCalledWith(newColumns);
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
      expect(mockTasksDataService.cancelTask).toHaveBeenCalledWith(task.raw.id);
    });

    it('should not permit to cancel tasks if the task is not cancellable', () => {
      if (component.actions[3].condition) {
        expect(component.actions[3].condition(task)).toBeFalsy();
      }
    });

    it('should open views in logs', () => {
      const spy = jest.spyOn(window, 'open').mockImplementation(() => null);
      component.serviceIcon = 'icon';
      component.serviceName = 'service';
      component.urlTemplate = 'https://myurl.com?taskId=%taskId';
      component.actions[4].action$.next(task);
      expect(spy).toHaveBeenCalledWith(`https://myurl.com?taskId=${task.raw.id}`, '_blank');
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
    expect(component.displayedColumns).toEqual(displayedColumns);
  });
});