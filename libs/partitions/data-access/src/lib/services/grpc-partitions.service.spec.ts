import { TestBed } from '@angular/core/testing';
import {
  ListPartitionsRequest,
  PartitionsClient,
} from '@aneoconsultingfr/armonik.api';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcPartitionsService } from './grpc-partitions.service';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import {
  ClrDatagridComparatorInterface,
  ClrDatagridStateInterface,
} from '@clr/angular';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';

describe('GrpcTasksService', () => {
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
      orderBy: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID,
      order: 1,
      filter: {} as ListPartitionsRequest.Filter,
    });
  });

  it('should create a list of specified request params', () => {
    const state: ClrDatagridStateInterface = {
      page: {
        current: 2,
        size: 50,
      },
      sort: {
        by: ListPartitionsRequest.OrderByField
          .ORDER_BY_FIELD_POD_MAX as unknown as ClrDatagridComparatorInterface<number>,
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
      orderBy: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_POD_MAX,
      order: 2,
      filter: {
        id: 'Some test id',
      } as ListPartitionsRequest.Filter,
    });
  });

  it('should create a default request query', () => {
    const result = service.createListRequestQueryParams({
      page: 0,
      pageSize: 10,
      orderBy: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID,
      order: ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_ASC,
      filter: {} as ListPartitionsRequest.Filter,
    });
    expect(result).toEqual({
      page: undefined,
      pageSize: undefined,
      orderBy: undefined,
      order: undefined,
    });
  });

  it('should create a request query', () => {
    const result = service.createListRequestQueryParams({
      page: 2,
      pageSize: 50,
      orderBy: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_POD_MAX,
      order: ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      filter: {
        id: 'Some test id',
      } as ListPartitionsRequest.Filter,
    });
    expect(result).toEqual({
      page: 2,
      pageSize: 50,
      orderBy: 4,
      order: 2,
      id: 'Some test id',
    });
  });

  it('should create a default list of request options', () => {
    const result = service.createListRequestOptions({
      page: 0,
      pageSize: 10,
      orderBy: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID,
      order: ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_ASC,
      filter: {} as ListPartitionsRequest.Filter,
    });
    expect(result).toEqual(
      new ListPartitionsRequest({
        page: 0,
        pageSize: 10,
        sort: {
          field: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID,
          direction: ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_ASC,
        },
        filter: {
          id: '',
          parentPartitionId: '',
          podMax: 0,
          podReserved: 0,
          preemptionPercentage: 0,
          priority: 0,
        },
      })
    );
  });

  it('should create a list of request options', () => {
    const result = service.createListRequestOptions({
      page: 2,
      pageSize: 50,
      orderBy: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_POD_MAX,
      order: ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      filter: {
        id: 'Some test id',
      } as ListPartitionsRequest.Filter,
    });
    expect(result).toEqual(
      new ListPartitionsRequest({
        page: 2,
        pageSize: 50,
        sort: {
          field: ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_POD_MAX,
          direction: ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
        },
        filter: {
          id: 'Some test id',
          parentPartitionId: '',
          podMax: 0,
          podReserved: 0,
          preemptionPercentage: 0,
          priority: 0,
        },
      })
    );
  });
});
