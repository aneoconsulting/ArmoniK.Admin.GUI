import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject, of } from 'rxjs';
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
    list$: jest.fn(() => of({tasks: [{id: 'task1'}, {id: 'task2'}, {id: 'task3'}], total: 3})),
    cancel$: jest.fn(() => of({})),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TasksTableComponent,
        {provide: TasksIndexService, useValue: mockTasksIndexService},
        { provide: TasksGrpcService, useValue: mockTasksGrpcService },
        TasksStatusesService,
        FiltersService,
        {provide: NotificationService, useValue: mockNotificationService},
        {provide: Clipboard, useValue: mockClipBoard},
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

  it('should check if the task is retried', () => {
    const task: TaskSummary = {
      status: TaskStatus.TASK_STATUS_RETRIED
    } as unknown as TaskSummary;
    expect(component.isRetried(task)).toBeTruthy(); 
  });


  it('should create the params to filter results', () => {
    const id = 'taskId';
    expect(component.createResultsQueryParams(id)).toEqual({
      '1-root-3-0': id
    });
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
    component.onSelectionChange([{id: 'taskId1'}, {id: 'taskId2'}] as unknown as TaskSummary[]);
    expect(spy).toHaveBeenCalledWith(['taskId1', 'taskId2']);
  });
});