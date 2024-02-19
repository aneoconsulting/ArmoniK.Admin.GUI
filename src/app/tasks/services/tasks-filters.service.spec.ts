import { TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersAnd } from '@app/types/filters';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TasksFiltersService } from './tasks-filters.service';
import { TasksStatusesService } from './tasks-statuses.service';
import { TaskFilterDefinition, TaskFilterField, TaskSummaryFilters } from '../types';


describe('TasksFilterService', () => {
  let service: TasksFiltersService;
  const mockTasksStatusesService = {
    statuses: {
      0: $localize`Unspecified`,
      3: $localize`Dispatched`,
      1: $localize`Creating`,
      2: $localize`Submitted`,
      9: $localize`Processing`,
      10: $localize`Processed`,
      7: $localize`Cancelling`,
      8: $localize`Cancelled`,
      4: $localize`Completed`,
      5: $localize`Error`,
      6: $localize`Timeout`,
      11: $localize`Retried`,
    }
  };
  const mockTableService = {
    saveFilters: jest.fn(),
    resetFilters: jest.fn(),
    restoreFilters: jest.fn(),
  };
  const expectedFiltersDefinitions : TaskFilterDefinition[] = [
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_INITIAL_TASK_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: 2,
      type: 'status',
      statuses: Object.keys(mockTasksStatusesService.statuses).map(status => {
        return {
          key: status,
          value: mockTasksStatusesService.statuses[Number(status) as TaskStatus],
        };
      }),
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ACQUIRED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ENDED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SUBMITTED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STARTED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_RECEIVED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_HOSTNAME,
      type: 'string'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_OWNER_POD_ID,
      type: 'string'
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_TTL,
      type: 'date'
    },
    {  
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
      type: 'string'
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE,
      type: 'string'
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_SERVICE,
      type: 'string'
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
      type: 'string'
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_ENGINE_TYPE,
      type: 'string'
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
      type: 'string'
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PRIORITY,
      type: 'number'
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES,
      type: 'number'
    }
  ];

  const filterAnd: FiltersAnd<number, number> = [{
    field: 1,
    for: 'root',
    operator: 1,
    value: 'Dummy'
  }];
  const mockTaskSummaryfilterOr: TaskSummaryFilters = [
    filterAnd
  ];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksFiltersService,
        DefaultConfigService,
        {provide: TasksStatusesService, useValue: mockTasksStatusesService}, 
        {provide: TableService, useValue: mockTableService}
        
      ]
    }).inject(TasksFiltersService);
  });

  test('the service must create TasksFilterService', () => {
    expect(service).toBeTruthy();
  }); 

  test('the service must call saveFilters from Table Service', () => {
    const spySaveFilters = jest.spyOn(mockTableService, 'saveFilters');
    const filters = mockTaskSummaryfilterOr;
    service.saveFilters(filters);
    expect(spySaveFilters).toHaveBeenCalledWith('tasks-filters', filters);
  });

  test('the service must call restoreFilters from Table Service', () => {
    const spyRestoreFilters = jest.spyOn(mockTableService, 'restoreFilters');
    service.restoreFilters();
    expect(spyRestoreFilters).toHaveBeenCalledWith('tasks-filters', expectedFiltersDefinitions);
  });
  test('the service must call resetFilters from Table Service', () => {
    const spyRestoreFilters = jest.spyOn(mockTableService, 'resetFilters');
    const mockDefaultFilters = new DefaultConfigService().defaultTasks.filters;
    service.resetFilters();
    expect(spyRestoreFilters).toHaveBeenCalledWith('tasks-filters');
    expect(service.resetFilters()).toEqual(mockDefaultFilters);
  });
  test('the service must return #filtersDefinitions', () =>{
    expect(service.retrieveFiltersDefinitions()).toEqual(expectedFiltersDefinitions);
  });

  test('the service must return the right label with filterFor root', () => {
    const mockLabelFilterRoot = service.retrieveLabel(expectedFiltersDefinitions[2].for, (expectedFiltersDefinitions[2].field as TaskFilterField));
    expect(mockLabelFilterRoot).toEqual('Initial Task ID');
  });

  test('the service must return the right label with filterFor options', () => {
    const mockLabelFilterOptions = service.retrieveLabel(expectedFiltersDefinitions[18].for, (expectedFiltersDefinitions[18].field as TaskFilterField));
    expect(mockLabelFilterOptions).toEqual('Partition ID');
  });

  test('the service must throw an error ', () => {
    const mockFilterFor = {for: 'dummy for'} as never;
    const mockFilterField = expectedFiltersDefinitions[6].field; 
    expect(() => {service.retrieveLabel(mockFilterFor , (mockFilterField as TaskFilterField) );}).toThrowError(`Unknown filter type: ${mockFilterFor} ${mockFilterField}`);
  });
});