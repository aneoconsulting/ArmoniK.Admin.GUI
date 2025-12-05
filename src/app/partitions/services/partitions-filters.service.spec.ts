import { FilterStringOperator, PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersOr } from '@app/types/filters';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersCacheService } from '@services/filters-cache.service';
import { TableService } from '@services/table.service';
import { PartitionsFiltersService } from './partitions-filters.service';
import { PartitionRawFilters } from '../types';

describe('PartitionsFilterService', () => {
  let service: PartitionsFiltersService;

  const storedFilters: PartitionRawFilters = [[
    {
      field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
      for: 'root',
      operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
      value: 'partitionId'
    }
  ]];

  const showFilters = false;

  const mockTableService = {
    saveFilters: jest.fn(),
    restoreFilters: jest.fn((): PartitionRawFilters | undefined => storedFilters),
    resetFilters: jest.fn(),
    saveShowFilters: jest.fn(),
    restoreShowFilters: jest.fn((): boolean | null => showFilters),
  };

  const cachedFilters: FiltersOr<PartitionRawEnumField> = [[{
    field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
    for: 'root',
    operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
    value: 'partition'
  }]];

  const mockFiltersCacheService = {
    get: jest.fn(() => cachedFilters),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        PartitionsFiltersService,
        DefaultConfigService,
        { provide: TableService, useValue: mockTableService },
        { provide: FiltersCacheService, useValue: mockFiltersCacheService },
      ]
    }).inject(PartitionsFiltersService);
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
    const filters: PartitionRawFilters = [[
      {
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'someId'
      }
    ]];
    service.saveFilters(filters);
    expect(mockTableService.saveFilters).toHaveBeenCalledWith('partitions-filters', filters);
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
    expect(mockTableService.saveShowFilters).toHaveBeenCalledWith('partitions-show-filters', true);
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
      expect(service.retrieveLabel('root', PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID)).toEqual('ID');
    });

    it('should return an empty string for options cases', () => {
      expect(service.retrieveLabel('options', PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID)).toEqual('');
    });

    it('should return an empty string for unknown filter type', () => {
      expect(service.retrieveLabel('custom', PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID)).toEqual('');
    });

    it('should log an error when filterFor is unknown', () => {
      const field = PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID;
      const _for = 'custom';
      service.retrieveLabel(_for, field);
      expect(consoleSpy).toHaveBeenCalledWith(`Unknown filter type: ${_for} ${field}`);
    });
  });

  it('should return filters definitions', () => {
    expect(service.retrieveFiltersDefinitions()).toEqual(service.filtersDefinitions);
  });

  describe('RetrieveField', () => {
    it('should retrieve Field', () => {
      expect(service.retrieveField('Pod Reserved')).toEqual({
        for: 'root',
        index: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_RESERVED
      });
    });

    it('should return undefined if there is no matching label', () => {
      expect(service.retrieveField('something')).toBeUndefined();
    });
  });
});