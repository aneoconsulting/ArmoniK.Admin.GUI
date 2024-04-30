import { FilterStringOperator, PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
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

  const mockTableService = {
    saveFilters: jest.fn(),
    restoreFilters: jest.fn((): PartitionRawFilters | undefined => storedFilters),
    resetFilters: jest.fn(),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        PartitionsFiltersService,
        DefaultConfigService,
        { provide: TableService, useValue: mockTableService }
      ]
    }).inject(PartitionsFiltersService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
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

  describe('retrieveLabel', () => {
    it('should permit to retrieve label', () => {
      expect(service.retrieveLabel('root', PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID)).toEqual('ID');
    });

    it('should throw an error for options cases', () => {
      expect(() => service.retrieveLabel('options', PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID)).toThrow('Impossible case');
    });

    it('should throw an error for unknown filter type', () => {
      expect(() => service.retrieveLabel('custom', PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID)).toThrow(`Unknown filter type: custom ${PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID}`);
    });
  });

  it('should return filters definitions', () => {
    expect(service.retrieveFiltersDefinitions()).toEqual(service.filtersDefinitions);
  });

  it('should retrieve Field', () => {
    expect(service.retrieveField('Pod Reserved')).toEqual({
      for: 'root',
      index: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_RESERVED
    });
  });
});