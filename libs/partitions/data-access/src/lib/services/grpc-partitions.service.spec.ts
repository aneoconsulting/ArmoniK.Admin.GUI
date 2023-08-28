import { TestBed } from '@angular/core/testing';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcPartitionsService } from './grpc-partitions.service';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import {
  ClrDatagridComparatorInterface,
  ClrDatagridStateInterface,
} from '@clr/angular';
import {
  FilterStringOperator,
  ListPartitionsRequest,
  PartitionRawEnumField,
  PartitionsClient,
  SortDirection,
} from '@aneoconsultingfr/armonik.api.angular';

describe('GrpcPartitionsService', () => {
  let service: GrpcPartitionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GrpcCoreModule.forRoot(),
        GrpcWebClientModule.forRoot({
          settings: {
            host: '',
          },
        }),
      ],
      providers: [GrpcPartitionsService, PartitionsClient, GrpcParamsService],
    });
    service = TestBed.inject(GrpcPartitionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

    it('should create a default list of request params', () => {
      const state: ClrDatagridStateInterface = {};
      const requestParams = service.createListRequestParams(state);
      expect(requestParams).toEqual({
        page: 0,
        pageSize: 10,
        orderBy: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
        order: 1,
        filter: {},
      });
    });

    it('should create a list of specified request params', () => {
      const state: ClrDatagridStateInterface = {
        page: {
          current: 2,
          size: 50,
        },
        sort: {
          by: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX as unknown as ClrDatagridComparatorInterface<number>,
          reverse: true,
        },
        filters: [
          {
            property: 'id',
            value: 'Some test id',
          },
        ],
      };
      const requestParams = service.createListRequestParams(state);
      expect(requestParams).toEqual({
        page: 1,
        pageSize: 50,
        orderBy: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX,
        order: 2,
        filter: {
          id: 'Some test id',
        },
      });
    });

    it('should create a default request query', () => {
      const result = service.createListRequestQueryParams(
        {
          page: 0,
          pageSize: 10,
          orderBy: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
          order: SortDirection.SORT_DIRECTION_ASC,
          filter: {},
        },
        10000
      );
      expect(result).toEqual({
        page: undefined,
        pageSize: undefined,
        interval: undefined,
        orderBy: undefined,
        order: undefined,
      });
    });

    it('should create a request query', () => {
      const result = service.createListRequestQueryParams(
        {
          page: 2,
          pageSize: 50,
          orderBy: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX,
          order: SortDirection.SORT_DIRECTION_DESC,
          filter: {
            id: 'Some test id',
          },
        },
        30000
      );
      expect(result).toEqual({
        page: 2,
        pageSize: 50,
        interval: 30000,
        orderBy: 4,
        order: 2,
        id: 'Some test id',
      });
    });

    it('should create a default list of request options', () => {
      const result = service.createListRequestOptions({
        page: 0,
        pageSize: 10,
        orderBy: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
        order: SortDirection.SORT_DIRECTION_ASC,
        filter: {},
      });
      expect(result).toEqual(
        new ListPartitionsRequest({
          page: 0,
          pageSize: 10,
          sort: {
            field: {
              partitionRawField: {
                field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID
              },
            },
            direction: SortDirection.SORT_DIRECTION_ASC,
          },
          filters: {
      or: [
        {
          and: [],
        },
      ],
    },
        })
      );
    });

    it('should create a list of request options', () => {
      const result = service.createListRequestOptions({
        page: 2,
        pageSize: 50,
        orderBy: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX,
        order: SortDirection.SORT_DIRECTION_DESC,
        filter: {
          id: 'Some test id',
        },
      });
      expect(result).toEqual(
        new ListPartitionsRequest({
          page: 2,
          pageSize: 50,
          sort: {
            field: {
              partitionRawField: {
                field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX
                },
            },
            direction: SortDirection.SORT_DIRECTION_DESC,
          },
          filters: {
      or: [
        {
          and: [{
            field: {
              partitionRawField: {
                field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID
              }
            },
            filterString: {
              operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
              value: 'Some test id',
            }
          }],
        },
      ],
    },
        })
      );
    });
});
