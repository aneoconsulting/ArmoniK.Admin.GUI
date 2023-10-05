import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersAnd } from '@app/types/filters';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TasksFiltersService } from './tasks-filters.service';
import { TasksStatusesService } from './tasks-status.service';
import { TaskFilterDefinition, TaskSummaryFiltersOr } from '../types';


describe('TasksFilterService', () => {
  let service: TasksFiltersService;
  const mockDefaultConfigService = {
    defaultTasks: {
      filters: [] as unknown as TaskSummaryFiltersOr 
    }
  };
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
      4: $localize`Finished`,
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
  const mockFiltersDefinitions : TaskFilterDefinition[] = [
    {
      for: 'root',
      field: 16,
      type: 'string',
    },
    {
      for: 'root',
      field: 1,
      type: 'string',
    },
    {
      for: 'root',
      field: 10,
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
      for: 'options',
      field: 5,
      type: 'string',
    },
    {
      for: 'options',
      field: 6,
      type: 'string',
    },
    {
      for: 'options',
      field: 4,
      type: 'string',
    }
  ];

  const filterAnd: FiltersAnd<number, number> = [{
    field: 1,
    for: 'root',
    operator: 1,
    value: 'Dummy'
  }];
  const mockTaskSummaryfilterOr: TaskSummaryFiltersOr = [
    filterAnd
  ];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksFiltersService,
        {provide: TasksStatusesService, useValue: mockTasksStatusesService},
        {provide: DefaultConfigService, useValue: mockDefaultConfigService }, 
        {provide: TableService, useValue: mockTableService}
        
      ]
    }).inject(TasksFiltersService);
  });

  test('the service must create TasksFilterService', () => {
    expect(service).toBeTruthy();
  }); 

  test('the service must call saveFilters from Table Service', () => {
    const filters = mockTaskSummaryfilterOr;
    service.saveFilters(filters);
    const spySaveFilters = jest.spyOn(mockTableService, 'saveFilters');
    expect(spySaveFilters).toHaveBeenCalled();
    expect(spySaveFilters).toHaveBeenCalledWith('tasks-filters', filters);
  });

  test('the service must call restoreFilters from Table Service', () => {
    const spyRestoreFilters = jest.spyOn(mockTableService, 'restoreFilters');
    service.restoreFilters();
    expect(spyRestoreFilters).toHaveBeenCalledWith('tasks-filters', mockFiltersDefinitions);
  });
  test('the service must call resetFilters from Table Service', () => {
    service.resetFilters();
    const spyRestoreFilters = jest.spyOn(mockTableService, 'resetFilters');
    const mockDefaultFilters = mockDefaultConfigService.defaultTasks.filters;
    expect(spyRestoreFilters).toHaveBeenCalled();
    expect(spyRestoreFilters).toHaveBeenCalledWith('tasks-filters');
    expect(service.resetFilters()).toBe(mockDefaultFilters);
  });
  test('the service must return #filtersDefinitions', () =>{
    expect(service.retrieveFiltersDefinitions()).toEqual(mockFiltersDefinitions);
  });

  test('the service must return the right label with filterFor root', () => {
    const mockLabelFilterRoot = service.retrieveLabel(mockFiltersDefinitions[2].for, mockFiltersDefinitions[2].field);
    expect(mockLabelFilterRoot).toEqual('Initial Task ID');
  });

  test('the service must return the right label with filterFor options', () => {
    const mockLabelFilterOptions = service.retrieveLabel(mockFiltersDefinitions[6].for, mockFiltersDefinitions[6].field);
    expect(mockLabelFilterOptions).toEqual('Partition ID');
  });

  test('the service must throw an error ', () => {
    const mockFilterFor = {for: 'dummy for'} as never;
    const mockFilterField = expectedFiltersDefinitions[6].field; 
    expect(() => {service.retrieveLabel(mockFilterFor , mockFilterField );}).toThrowError(`Unknown filter type: ${mockFilterFor} ${mockFilterField}`);
  });
});