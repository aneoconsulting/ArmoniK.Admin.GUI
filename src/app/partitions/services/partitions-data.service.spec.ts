import { FilterArrayOperator, FilterNumberOperator, FilterStringOperator, ListPartitionsResponse, PartitionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { of, throwError } from 'rxjs';
import PartitionsDataService from './partitions-data.service';
import { PartitionsGrpcService } from './partitions-grpc.service';
import { PartitionRaw } from '../types';

describe('PartitionsDataService', () => {
  let service: PartitionsDataService;

  const cachedPartitions = { partitions: [{ id: 'partition1' }, { id: 'partition2', }], total: 2 } as unknown as ListPartitionsResponse;
  const mockCacheService = {
    get: jest.fn(() => cachedPartitions),
    save: jest.fn(),
  };

  const partitions = { partitions: [{ id: 'partition1' }, { id: 'partition2', }, { id: 'partition3', }], total: 3 }  as unknown as ListPartitionsResponse;
  const mockPartitionsGrpcService = {
    list$: jest.fn(() => of(partitions)),
  };

  const mockNotificationService = {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  const initialOptions: ListOptions<PartitionRaw> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'id',
      direction: 'desc'
    }
  };

  const initialFilters: FiltersOr<PartitionRawEnumField> = [];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        PartitionsDataService,
        FiltersService,
        { provide: PartitionsGrpcService, useValue: mockPartitionsGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: CacheService, useValue: mockCacheService },
      ]
    }).inject(PartitionsDataService);
    service.options = initialOptions;
    service.filters = initialFilters;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should load data from the cache', () => {
      expect(service.data()).toEqual([
        {
          raw: {
            id: 'partition1',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition1',
          },
          filters: [[
            { 
              for: 'options',
              field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
              operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
              value: 'partition1'
            },
          ]]
        },
        {
          raw: {
            id: 'partition2',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition2',
          },
          filters: [[
            {
              for: 'options',
              field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
              operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
              value: 'partition2'
            },
          ]]
        },
      ]);
    });

    it('should set the total cached data', () => {
      expect(service.total()).toEqual(cachedPartitions.total);
    });
  });

  describe('Fetching data', () => {
    it('should list the data', () => {
      service.refresh$.next();
      expect(mockPartitionsGrpcService.list$).toHaveBeenCalledWith(service.options, service.filters);
    });
    
    it('should update the total', () => {
      service.refresh$.next();
      expect(service.total()).toEqual(partitions.total);
    });

    it('should update the data', () => {
      service.refresh$.next();
      expect(service.data()).toEqual([
        {
          raw: {
            id: 'partition1',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition1',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition1' },
          ]]
        },
        {
          raw: {
            id: 'partition2',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition2',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition2' },
          ]]
        },
        {
          raw: {
            id: 'partition3',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition3',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition3' },
          ]]
        }
      ]);
    });

    it('should handle an empty DataRaw', () => {
      const partitions = { partitions: undefined, total: 0} as unknown as ListPartitionsResponse;
      mockPartitionsGrpcService.list$.mockReturnValueOnce(of(partitions));
      service.refresh$.next();
      expect(service.data()).toEqual([]);
    });

    it('should catch errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPartitionsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should notify errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPartitionsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should cache the raw data', () => {
      service.refresh$.next();
      expect(mockCacheService.save).toHaveBeenCalledWith(service.scope, partitions);
    });
  });

  it('should display a success message', () => {
    const message = 'A success message !';
    service.success(message);
    expect(mockNotificationService.success).toHaveBeenCalledWith(message);
  });

  it('should display a warning message', () => {
    const message = 'A warning message !';
    service.warning(message);
    expect(mockNotificationService.warning).toHaveBeenCalledWith(message);
  });

  it('should display an error message', () => {
    const error: GrpcStatusEvent = {
      statusMessage: 'A error status message'
    } as GrpcStatusEvent;
    jest.spyOn(console, 'error').mockImplementation(() => {});
    service.error(error);
    expect(mockNotificationService.error).toHaveBeenCalledWith(error.statusMessage);
  });

  it('should load correctly', () => {
    expect(service.loading()).toBeFalsy();
  });

  describe('Applying filters', () => {
    const filters: FiltersOr<PartitionRawEnumField> = [
      [
        {
          field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
          value: 'a',
        },
        {
          field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PARENT_PARTITION_IDS,
          for: 'root',
          operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS,
          value: 'partition1',
        },
      ],
      [
        {
          field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
          for: 'root',
          operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
          value: 1, 
        }
      ]
    ];

    it('should apply the filters correctly when transforming the data', () => {
      service.filters = filters;
      service.refresh$.next();
      expect(service.data()).toEqual([
        {
          raw: {
            id: 'partition1',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition1',
            '0-options-4-2': 'a',
            '1-options-4-0': 'partition1',
            '1-options-3-0': '1'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition1' },
          ]]
        },
        {
          raw: {
            id: 'partition2',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition2',
            '0-options-4-2': 'a',
            '1-options-4-0': 'partition2',
            '1-options-3-0': '1'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition2' },
          ]]
        },
        {
          raw: {
            id: 'partition3',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition3',
            '0-options-4-2': 'a',
            '1-options-4-0': 'partition3',
            '1-options-3-0': '1'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition3' },
          ]]
        }
      ]);
    });
  });
});