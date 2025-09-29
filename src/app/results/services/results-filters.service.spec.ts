import { FilterDateOperator, FilterStringOperator, ResultRawEnumField, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersOr } from '@app/types/filters';
import { StatusService } from '@app/types/status';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersCacheService } from '@services/filters-cache.service';
import { TableService } from '@services/table.service';
import { ResultsFiltersService } from './results-filters.service';
import { ResultRawFilters } from '../types';

describe('ResultsFilterService', () => {
  let service: ResultsFiltersService;

  const storedFilters: ResultRawFilters = [[
    {
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
      for: 'root',
      operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
      value: 'resultId'
    }
  ]];

  const showFilters = false;

  const mockTableService = {
    saveFilters: jest.fn(),
    restoreFilters: jest.fn((): ResultRawFilters | undefined => storedFilters),
    resetFilters: jest.fn(),
    saveShowFilters: jest.fn(),
    restoreShowFilters: jest.fn((): boolean | null => showFilters),
  };

  const cachedFilters: FiltersOr<ResultRawEnumField> = [[{
    field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_COMPLETED_AT,
    for: 'root',
    operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER,
    value: '1'
  }]];

  const mockFiltersCacheService = {
    get: jest.fn(() => cachedFilters),
  };

  const mockStatusService = {
    statuses: {
      [ResultStatus.RESULT_STATUS_ABORTED]: {
        label: 'Aborted',
      },
      [ResultStatus.RESULT_STATUS_COMPLETED]: {
        label: 'Completed'
      },
    },
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ResultsFiltersService,
        DefaultConfigService,
        { provide: StatusService, useValue: mockStatusService },
        { provide: TableService, useValue: mockTableService },
        { provide: FiltersCacheService, useValue: mockFiltersCacheService }
      ]
    }).inject(ResultsFiltersService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should get filters from the filterCache', () => {
      expect(mockFiltersCacheService.get).toHaveBeenCalledWith(service['scope']);
    });

    it('should save the cached filters if they exist', () => {
      expect(mockTableService.saveFilters).toHaveBeenCalledWith(`${service['scope']}-filters`, cachedFilters);
    });
  });

  it('should save filters', () => {
    const filters: ResultRawFilters = [[
      {
        field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'someSession'
      }
    ]];
    service.saveFilters(filters);
    expect(mockTableService.saveFilters).toHaveBeenCalledWith('results-filters', filters);
  });

  describe('restore filters', () => {
    it('should restore filters', () => {
      expect(service.restoreFilters()).toEqual(storedFilters);
    });

    it('should restore default filters if no filters are stored', () => {
      mockTableService.restoreFilters.mockReturnValueOnce(undefined);
      expect(service.restoreFilters()).toEqual(service.defaultFilters);
    });
  });

  describe('reset filter', () => {
    it('should reset filters', () => {
      service.resetFilters();
      expect(mockTableService.resetFilters).toHaveBeenCalled();
    });

    it('should return default filters', () => {
      expect(service.resetFilters()).toEqual(service.defaultFilters);
    });
  });

  it('should save showFilters', () => {
    service.saveShowFilters(true);
    expect(mockTableService.saveShowFilters).toHaveBeenCalledWith('results-show-filters', true);
  });

  describe('restoreShowFilters', () => {
    it('should restore showFilters', () => {
      expect(service.restoreShowFilters()).toBe(showFilters);
    });

    it('should restore default showFilters if it cannot restore', () => {
      mockTableService.restoreShowFilters.mockReturnValueOnce(null);
      expect(service.restoreShowFilters()).toBeTruthy();
    });
  });

  describe('retrieveLabel', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error');
      consoleSpy.mockImplementationOnce(() => {});
    });

    it('should permit to retrieve label', () => {
      expect(service.retrieveLabel('root', ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID)).toEqual('Result ID');
    });

    it('should return an empty string for options cases', () => {
      expect(service.retrieveLabel('options', ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID)).toEqual('');
    });

    it('should return an empty string for unknown filter type', () => {
      expect(service.retrieveLabel('custom', ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID)).toEqual('');
    });

    it('should log an error when filterFor is unknown', () => {
      const field = ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID;
      const _for = 'custom';
      service.retrieveLabel(_for, field);
      expect(consoleSpy).toHaveBeenCalledWith(`Unknown filter type: ${_for} ${field}`);
    });
  });
});