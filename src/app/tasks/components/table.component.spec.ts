import { TaskStatus, TaskSummary } from '@aneoconsultingfr/armonik.api.angular';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TableColumn } from '@app/types/column.type';
import { TaskData } from '@app/types/data';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { TasksTableComponent } from './table.component';
import { TasksIndexService } from '../services/tasks-index.service';
import { TasksStatusesService } from '../services/tasks-statuses.service';
import { TaskSummaryColumnKey } from '../types';

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

  const sort: MatSort = {
    active: 'createdAt',
    direction: 'asc',
    sortChange: new EventEmitter()
  } as unknown as MatSort;

  const paginator: MatPaginator = {
    pageIndex: 2,
    pageSize: 50,
    page: new EventEmitter()
  } as unknown as MatPaginator;

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

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TasksTableComponent,
        {provide: TasksIndexService, useValue: mockTasksIndexService},
        TasksStatusesService,
        FiltersService,
        {provide: NotificationService, useValue: mockNotificationService}
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
    component.sort = sort;
    component.paginator = paginator;
    component.data = data;

    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should update options sort on sort change', () => {
    sort.sortChange.emit();
    expect(component.options.sort).toEqual({
      active: sort.active,
      direction: sort.direction
    });
  });

  it('should update options pagination on page change', () => {
    paginator.page.emit();
    expect(component.options).toEqual({
      pageIndex: paginator.pageIndex,
      pageSize: paginator.pageSize,
      sort: {
        active: 'id',
        direction: 'desc'
      }
    });
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
    component.onCopiedTaskId();
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

  it('should check if all rows are selected or not', () => {
    selection.selected.push('task1');
    expect(component.isAllSelected()).toBeFalsy();
  });

  describe('toggleAllRows', () => {
    it('should toggle all row to selected', () => {
      component.toggleAllRows();
      expect(selection.select).toHaveBeenCalledWith(...component.data.map(data => data.raw.id));
    });

    it('should clear all row', () => {
      selection.selected.push(...data.map(row => row.id));
      component.toggleAllRows();
      expect(selection.clear).toHaveBeenCalled();
    });
  });

  describe('checkBoxLabel', () => {
    it('should give the option to select all if they are not all selected', () => {
      selection.selected.push('task1');
      console.log('checkBox');
      expect(component.checkboxLabel()).toEqual('select all');
    });

    it('should give the option to deselect all if all are selected', () => {
      selection.selected.push(...data.map(row => row.id));
      console.log('checkBox');
      expect(component.checkboxLabel()).toEqual('deselect all');
    });

    it('should get the label to deselect a task', () => {
      const task = {raw: {id:'selected1'} as unknown as TaskSummary} as unknown as TaskData;
      expect(component.checkboxLabel(task)).toEqual('Deselect Task selected1');
    });

    it('should get the label to select one task', () => {
      const task = {raw: {id:'selected2'} as unknown as TaskSummary} as unknown as TaskData;
      expect(component.checkboxLabel(task)).toEqual('Select Task selected2');
    });
  });

  it('should track By column', () => {
    expect(component.trackByColumn(0, displayedColumns[0])).toEqual('id');
  });

  describe('onDrop', () => {
    it('should moveItem', () => {
      const event = {
        previousIndex: 0,
        currentIndex: 1
      } as unknown as CdkDragDrop<string[]>;
      component.onDrop(event);
      expect(component.displayedColumns).toEqual(displayedColumns);
    });

    it('should call tasksIndexService', () => {
      const event = {
        previousIndex: 0,
        currentIndex: 1
      } as unknown as CdkDragDrop<string[]>;
      component.onDrop(event);
      expect(mockTasksIndexService.saveColumns).toHaveBeenCalledWith(displayedColumns.map(column => column.key));
    });
  });
});