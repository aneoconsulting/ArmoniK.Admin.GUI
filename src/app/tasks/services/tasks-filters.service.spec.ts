import { TestBed } from '@angular/core/testing';
import { FiltersAnd } from '@app/types/filters';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TasksFiltersService } from './tasks-filters.service';
import { TasksStatusesService } from './tasks-statuses.service';
import { TaskFilterField, TaskSummaryFilters } from '../types';


describe('TasksFilterService', () => {
  let service: TasksFiltersService;
  const mockTableService = {
    saveFilters: jest.fn(),
    resetFilters: jest.fn(),
    restoreFilters: jest.fn(),
    saveShowFilters: jest.fn(),
    restoreShowFilters: jest.fn((): boolean | null => showFilters),
  };

  const showFilters = false;

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
        TasksStatusesService, 
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
    expect(spyRestoreFilters).toHaveBeenCalledWith('tasks-filters', service.filtersDefinitions);
  });

  test('the service must call resetFilters from Table Service', () => {
    const spyRestoreFilters = jest.spyOn(mockTableService, 'resetFilters');
    const mockDefaultFilters = new DefaultConfigService().defaultTasks.filters;
    service.resetFilters();
    expect(spyRestoreFilters).toHaveBeenCalledWith('tasks-filters');
    expect(service.resetFilters()).toEqual(mockDefaultFilters);
  });

  it('should save showFilters', () => {
    service.saveShowFilters(true);
    expect(mockTableService.saveShowFilters).toHaveBeenCalledWith('tasks-show-filters', true);
  });

  describe('restoreShowFilters', () => {
    it('should restore showFilters', () => {
      expect(service.restoreShowFilters()).toBe(showFilters);
    });

    it('should restore default showFilters if it cannot restore', () => {
      mockTableService.restoreShowFilters.mockReturnValueOnce(null);
      expect(service.restoreShowFilters()).toBe(true);
    });
  });

  test('the service must return filtersDefinitions', () =>{
    expect(service.retrieveFiltersDefinitions()).toEqual(service.filtersDefinitions);
  });

  test('the service must return the right label with filterFor root', () => {
    const mockLabelFilterRoot = service.retrieveLabel(service.filtersDefinitions[2].for, (service.filtersDefinitions[2].field as TaskFilterField));
    expect(mockLabelFilterRoot).toEqual('Initial Task ID');
  });

  test('the service must return the right label with filterFor options', () => {
    const mockLabelFilterOptions = service.retrieveLabel(service.filtersDefinitions[18].for, (service.filtersDefinitions[18].field as TaskFilterField));
    expect(mockLabelFilterOptions).toEqual('Application Version');
  });

  test('the service must throw an error ', () => {
    const mockFilterFor = {for: 'dummy for'} as never;
    const mockFilterField = service.filtersDefinitions[6].field; 
    expect(() => {service.retrieveLabel(mockFilterFor , (mockFilterField as TaskFilterField) );}).toThrowError(`Unknown filter type: ${mockFilterFor} ${mockFilterField}`);
  });

  describe('retrieveField', () => {
    it('should return the field of a root field', () => {
      expect(service.retrieveField('Session ID')).toEqual({
        for: 'root',
        index: 1,
      });
    });

    it('should return the field of an optional field', () => {
      expect(service.retrieveField('Application Version')).toEqual({
        for: 'options',
        index: 6,
      });
    });
  });
});