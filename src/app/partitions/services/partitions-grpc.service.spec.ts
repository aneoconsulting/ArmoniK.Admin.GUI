import { FilterArrayOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, GetPartitionRequest, ListPartitionsRequest, PartitionRawEnumField, PartitionsClient } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ListOptionsSort } from '@app/types/options';
import { UtilsService } from '@services/utils.service';
import { PartitionsFiltersService } from './partitions-filters.service';
import { PartitionsGrpcService } from './partitions-grpc.service';
import { PartitionRaw, PartitionRawFilters, PartitionRawListOptions } from '../types';

describe('PartitionsGrpcService', () => {
  let service: PartitionsGrpcService;

  const filters: PartitionRawFilters = [
    [
      {
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: 'partitionId'
      },
      {
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PARENT_PARTITION_IDS,
        for: 'root',
        operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS,
        value: '12323981203'
      },
    ],
    [
      {
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX,
        for: 'root',
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN,
        value: 100
      },
      {
        field: null,
        for: 'root',
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN_OR_EQUAL,
        value: 29
      }
    ]
  ];

  const options: PartitionRawListOptions = {
    pageIndex: 2,
    pageSize: 10,
    sort: {
      active: 'id',
      direction: 'asc'
    }
  };

  const mockPartitionsFiltersService = {
    filtersDefinitions: [
      {
        for: 'root',
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
        type: 'string'
      },
      {
        for: 'root',
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PARENT_PARTITION_IDS,
        type: 'array',
      },
      {
        for: 'root',
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX,
        type: 'number'
      },
      {
        for: 'root',
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_RESERVED,
        type: 'status'
      }
    ],
  };

  const mockPartitionsClient = {
    listPartitions: jest.fn(),
    getPartition: jest.fn(),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        PartitionsGrpcService,
        UtilsService,
        { provide: PartitionsFiltersService, useValue: mockPartitionsFiltersService },
        { provide: PartitionsClient, useValue: mockPartitionsClient }
      ]
    }).inject(PartitionsGrpcService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should list partitions', () => {
    service.list$(options, filters);
    expect(mockPartitionsClient.listPartitions).toHaveBeenCalledWith(new ListPartitionsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: 1,
        field: {
          partitionRawField: {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID
          }
        }
      },
      filters: {
        or: [
          {
            and: [
              {
                field: {
                  partitionRawField: {
                    field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID
                  }
                },
                filterString: {
                  operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
                  value: 'partitionId'
                }
              },
              {
                field: {
                  partitionRawField: {
                    field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PARENT_PARTITION_IDS
                  }
                },
                filterArray: {
                  operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS,
                  value: '12323981203'
                }
              },
            ]
          },
          {
            and: [
              {
                field: {
                  partitionRawField: {
                    field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX
                  }
                },
                filterNumber: {
                  operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN,
                  value: '100'
                }
              }
            ]
          }
        ]
      }
    }));
  });

  it('should throw on invalid filters', () => {
    const filters: PartitionRawFilters = [[{
      field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_RESERVED,
      for: 'root',
      operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
      value: 0
    }]];
    expect(() => service.list$(options, filters)).toThrow('Type status not supported');
  });

  it('should have a default sort field direction', () => {
    const options: PartitionRawListOptions = {
      pageIndex: 10,
      pageSize: 10,
      sort: {
        active: null,
        direction: 'asc'
      } as unknown as ListOptionsSort<PartitionRaw>
    };
    service.list$(options, [[]]);
    expect(mockPartitionsClient.listPartitions).toHaveBeenCalledWith(new ListPartitionsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: 1,
        field: {
          partitionRawField: {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID
          }
        }
      },
      filters: {}
    }));
  });

  it('should get a partition', () => {
    const id = 'partitionId';
    service.get$(id);
    expect(mockPartitionsClient.getPartition).toHaveBeenCalledWith(new GetPartitionRequest({ id }));
  });
});