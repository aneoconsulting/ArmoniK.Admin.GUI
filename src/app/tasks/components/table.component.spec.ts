import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { SelectionModel } from '@angular/cdk/collections';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { TaskData } from '@app/types/data';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { TasksTableComponent } from './table.component';
import { TasksIndexService } from '../services/tasks-index.service';
import { TasksStatusesService } from '../services/tasks-statuses.service';
import { TaskSummary, TaskSummaryColumnKey } from '../types';

describe('TasksTableComponent', () => {
  let component: TasksTableComponent;

  const data = [{id: 'task1'}, {id: 'task2'}, {id: 'task3'}] as unknown as TaskSummary[];

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

  const selection: SelectionModel<string> = {
    selected: [] as string[],
    clear: jest.fn(() => {selection.selected.forEach(() => selection.selected.pop());}),
    select: jest.fn(),
    isSelected: jest.fn((rowId: string) => rowId === 'selected1')
  } as unknown as SelectionModel<string>;

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
    success: jest.fn()
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TasksTableComponent,
        {provide: TasksIndexService, useValue: mockTasksIndexService},
        TasksStatusesService,
        FiltersService,
        {provide: NotificationService, useValue: mockNotificationService},
        {provide: Clipboard, useValue: mockClipBoard},
      ]
    }).inject(TasksTableComponent);

    selection.clear();

    component.displayedColumns = displayedColumns;
    component.selection = selection;
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'id',
        direction: 'desc'
      }
    };
    const data$ = new Subject<TaskSummary[]>();
    component.data$ = data$;
    component.ngAfterViewInit();
    data$.next(data);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should update data on next', () => {
    const newData = [{id: '1'}, {id: '2'}] as unknown as TaskSummary[];
    component.data$.next(newData);
    expect(component.data.map(d => d.raw)).toEqual(newData);
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
    const spy = jest.spyOn(component.cancelTask, 'emit');
    const id = 'taskId';
    component.onCancelTask(id);
    expect(spy).toHaveBeenCalledWith(id);
  });

  describe('generateViewInLogsUrl', () => {
    it('should return an empty string if there is no urlTemplate', () => {
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
});