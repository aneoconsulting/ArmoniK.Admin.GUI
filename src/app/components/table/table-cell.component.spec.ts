import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskSummaryColumnKey, TaskSummaryFilters } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ApplicationData, ArmonikData, DataRaw, PartitionData, SessionData, TaskData } from '@app/types/data';
import { TableCellComponent } from './table-cell.component';

describe('TableCellComponent', () => {
  let component: TableCellComponent<ArmonikData<DataRaw>, TaskSummaryColumnKey, TaskStatus>;

  const options = {
    applicationName: 'application-name',
    applicationVersion: 'application-version',
  };

  const createdAt: Timestamp = new Timestamp({
    seconds: '1343540',
    nanos: 0,
  });

  const column: TableColumn<TaskSummaryColumnKey> = {
    key: 'id',
    name: 'id',
    sortable: true,
  };

  const countFilters: TaskSummaryFilters = [
    [
      {
        field: 0,
        for: 'root',
        operator: 0,
        value: 'application-name',
      }
    ]
  ];

  const element: TaskData = {
    raw: {
      id: 'task-id',
      status: TaskStatus.TASK_STATUS_COMPLETED,
      creationToEndDuration: 1000,
      createdAt,
      options
    },
    queryTasksParams: {
      'application-name': 'application-name',
      'application-version': 'application-version',
    } as Record<string, string>,
    filters: countFilters,
  } as unknown as TaskData;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [ 
        TableCellComponent
      ]
    }).inject(TableCellComponent);
    component.column = column;
    component.element = element as unknown as ArmonikData<DataRaw>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set element', () => {
    expect(component.element).toEqual(element);
  });

  it('should get queryTasksParams', () => {
    expect(component.queryTasksParams).toEqual((element as unknown as SessionData | ApplicationData | PartitionData).queryTasksParams);
  });

  it('should get countFilters', () => {
    expect(component.countFilters).toEqual(countFilters);
  });

  describe('simple value', () => {
    beforeEach(() => {
      component.column = column;
    });

    it('should set value', () => {
      expect(component.value).toEqual('task-id');
    });
  });

  test('undefined element should return undefined value', () => {
    component.element = undefined as unknown as ArmonikData<DataRaw>;
    expect(component.value).toBeUndefined();
  });

  describe('link value', () => {
    beforeEach(() => {
      component.column.link = '/tasks';
      component.column.key = 'id';
      component.column.type = 'link';
      component.element = element as unknown as ArmonikData<DataRaw>;
    });

    it('should set link', () => {
      expect(component.link).toEqual('/tasks/task-id');
    });
  });

  describe('duration value', () => {
    beforeEach(() => {
      component.column.key = 'creationToEndDuration';
      component.column.type = 'duration';
      component.element = element as unknown as ArmonikData<DataRaw>;
    });

    it('should set durationValue', () => {
      expect(component.durationValue).toEqual(1000);
    });
  });

  describe('status value', () => {
    beforeEach(() => {
      column.key = 'status';
      column.type = 'status';
      component.column = column;
      component.statusesService = new TasksStatusesService();
      component.element = element as unknown as ArmonikData<DataRaw>;
    });

    it('should set statusValue', () => {
      expect(component.statusValue).toEqual(TaskStatus.TASK_STATUS_COMPLETED);
    });

    it('should get status label', () => {
      expect(component.statusLabel()).toEqual('Completed');
    });
  });

  describe('date value', () => {
    beforeEach(() => {
      column.key = 'createdAt';
      column.type = 'date';
      component.column = column;
      component.element = element as unknown as ArmonikData<DataRaw>;
    });

    it('should set dateValue', () => {
      expect(component.dateValue).toEqual(new Date(1343540 * 1000));
    });

    it('should return null if value is undefined', () => {
      component.element = {} as unknown as ArmonikData<DataRaw>;
      expect(component.dateValue).toBeNull();
    });
  });

  describe('object value', () => {
    beforeEach(() => {
      column.key = 'options';
      column.type = 'object';
      component.column = column;
      component.element = element as unknown as ArmonikData<DataRaw>;
    });

    it('should set value', () => {
      expect(component.value).toEqual(options);
    });
  });

  describe('selection', () => {

    beforeEach(() => {
      component.column.key = 'id';
      component.element = element as unknown as ArmonikData<DataRaw>;
    });

    it('should emit changeSelection', () => {
      const spy = jest.spyOn(component.changeSelection, 'emit');
      component.onSelectionChange();
      expect(spy).toHaveBeenCalled();
    });

    it('should tip to deselect if it is selected', () => {
      component.isSelected = true;
      expect(component.checkboxLabel()).toEqual('Deselect Task task-id');
    });

    it('should tip to select if it is unselected', () => {
      component.isSelected = false;
      expect(component.checkboxLabel()).toEqual('Select Task task-id');
    });
  });
});