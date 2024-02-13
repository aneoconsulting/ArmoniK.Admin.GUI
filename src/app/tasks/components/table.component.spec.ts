import { TaskStatus, TaskSummary } from '@aneoconsultingfr/armonik.api.angular';
import { SelectionModel } from '@angular/cdk/collections';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Duration , Timestamp} from '@ngx-grpc/well-known-types';
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

    component.displayedColumns = ['id', 'createdAt', 'select'];
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

  describe('show', () => {
    it('should show data from any non-options column', () => {
      const task = {
        id: '1234'
      } as unknown as TaskSummary;
      expect(component.show(task, 'id')).toEqual('1234');
    });

    it('should show any data from column options', () => {
      const task = {
        options: {
          applicationName: 'name'
        }
      } as unknown as TaskSummary;
      expect(component.show(task, 'options.applicationName')).toEqual('name');
    });

    it('should return null if options is null', () => {
      const task = {} as unknown as TaskSummary;
      expect(component.show(task, 'options.applicationName')).toEqual(null);
    });
  });

  describe('extractData', () => {
    it('should get the duration of the task', () => {
      const task = {
        creationToEndDuration: {
          seconds: '94350',
          nanos: 0
        }
      } as unknown as TaskSummary;
      expect(component.extractData(task, 'creationToEndDuration')).toEqual({
        seconds: '94350',
        nanos: 0
      } as Duration);
    });

    it('should get the duration of an option of the task', () => {
      const task = {
        options: {
          maxDuration: {
            seconds: '84370',
            nanos: 0
          }
        }
      } as unknown as TaskSummary;
      expect(component.extractData(task, 'options.maxDuration')).toEqual({
        seconds: '84370',
        nanos: 0
      });
    });

    it('should return null if there is no options', () => {
      expect(component.extractData({} as unknown as TaskSummary, 'options.maxDuration')).toEqual(null);
    });
  });

  it('should check if the column is action', () => {
    const column: TaskSummaryColumnKey = 'actions';
    component.isActionsColumn(column);
    expect(mockTasksIndexService.isActionsColumn).toHaveBeenCalledWith(column); 
  });

  it('should check if the column is "task id"', () => {
    const column: TaskSummaryColumnKey = 'id';
    component.isTaskIdColumn(column);
    expect(mockTasksIndexService.isTaskIdColumn).toHaveBeenCalledWith(column); 
  });

  it('should check if the column is status', () => {
    const column: TaskSummaryColumnKey = 'status';
    component.isStatusColumn(column);
    expect(mockTasksIndexService.isStatusColumn).toHaveBeenCalledWith(column); 
  });

  it('should check if the column is date', () => {
    const column: TaskSummaryColumnKey = 'createdAt';
    component.isDateColumn(column);
    expect(mockTasksIndexService.isDateColumn).toHaveBeenCalledWith(column); 
  });

  it('should check if the column is duration', () => {
    const column: TaskSummaryColumnKey = 'creationToEndDuration';
    component.isDurationColumn(column);
    expect(mockTasksIndexService.isDurationColumn).toHaveBeenCalledWith(column); 
  });

  it('should check if the column is object', () => {
    const column: TaskSummaryColumnKey = 'options';
    component.isObjectColumn(column);
    expect(mockTasksIndexService.isObjectColumn).toHaveBeenCalledWith(column); 
  });

  it('should check if the column is select', () => {
    const column: TaskSummaryColumnKey = 'select';
    component.isSelectColumn(column);
    expect(mockTasksIndexService.isSelectColumn).toHaveBeenCalledWith(column); 
  });

  it('should check if the column is simple', () => {
    const column: TaskSummaryColumnKey = 'statusMessage';
    component.isSimpleColumn(column);
    expect(mockTasksIndexService.isSimpleColumn).toHaveBeenCalledWith(column); 
  });

  it('should check if the column is not sortable', () => {
    const column: TaskSummaryColumnKey = 'options';
    component.isNotSortableColumn(column);
    expect(mockTasksIndexService.isNotSortableColumn).toHaveBeenCalledWith(column); 
  });

  it('should check if the task is retried', () => {
    const task: TaskSummary = {
      status: TaskStatus.TASK_STATUS_RETRIED
    } as unknown as TaskSummary;
    expect(component.isRetried(task)).toBeTruthy(); 
  });

  describe('columnToDate', () => {
    it('should turn a date to a string', () => {
      const time = {
        toDate: jest.fn()
      } as unknown as Timestamp;
      component.columnToDate(time);
      expect(time.toDate).toHaveBeenCalled();
    });

    it('should return null if the object is undefined',() => {
      const time = undefined as unknown as Timestamp;
      expect(component.columnToDate(time)).toEqual(null);
    });
  });

  it('should get statuses labels', () => {
    expect(component.statusToLabel(TaskStatus.TASK_STATUS_COMPLETED)).toEqual('Completed');
  });

  it('should get the columns labels', () => {
    component.columnToLabel('id');
    expect(mockTasksIndexService.columnToLabel).toHaveBeenCalledWith('id');
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
    expect(component.trackByColumn(0, 'id')).toEqual('id');
  });

  describe('onDrop', () => {
    it('should moveItem', () => {
      const event = {
        previousIndex: 0,
        currentIndex: 1
      } as unknown as CdkDragDrop<string[]>;
      component.onDrop(event);
      expect(component.displayedColumns).toEqual(['createdAt', 'id', 'select']);
    });

    it('should call tasksIndexService', () => {
      const event = {
        previousIndex: 0,
        currentIndex: 1
      } as unknown as CdkDragDrop<string[]>;
      component.onDrop(event);
      expect(mockTasksIndexService.saveColumns).toHaveBeenCalledWith(['createdAt', 'id', 'select']);
    });
  });

  it('should handle nested keys for options.options', () => {
    const element = {
      options: {
        options: {
          key: 'Hey'
        }
      }
    } as unknown as {[key: string]: object};
    expect(component.handleNestedKeys('options.options.key', element)).toEqual('Hey');
  });
});