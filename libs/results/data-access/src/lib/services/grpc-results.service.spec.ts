import { TestBed } from '@angular/core/testing';
import {
  GrpcParamsService,
  ListResultsRequest,
  ResultsClient,
} from '@armonik.admin.gui/shared/data-access';
import {
  ClrDatagridComparatorInterface,
  ClrDatagridStateInterface,
} from '@clr/angular';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcResultsService } from './grpc-results.service';

describe('GrpcResultsService', () => {
  let service: GrpcResultsService;

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
      providers: [GrpcResultsService, ResultsClient, GrpcParamsService],
    });
    service = TestBed.inject(GrpcResultsService);
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
      orderBy: ListResultsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
      order: 1,
      filter: {} as ListResultsRequest.Filter,
    });
  });

  it('should create a list of specified request params', () => {
    const state: ClrDatagridStateInterface = {
      page: {
        current: 2,
        size: 50,
      },
      sort: {
        by: ListResultsRequest.OrderByField
          .ORDER_BY_FIELD_SESSION_ID as unknown as ClrDatagridComparatorInterface<number>,
        reverse: true,
      },
      filters: [
        {
          property: 'sessionId',
          value: 'Some test sessionId',
        },
      ],
    };
    const requestParams = service.createListRequestParams(state);
    expect(requestParams).toEqual({
      page: 1,
      pageSize: 50,
      orderBy: ListResultsRequest.OrderByField.ORDER_BY_FIELD_SESSION_ID,
      order: 2,
      filter: {
        sessionId: 'Some test sessionId',
      } as ListResultsRequest.Filter,
    });
  });

  it('should create a default request query', () => {
    const result = service.createListRequestQueryParams({
      page: 0,
      pageSize: 10,
      orderBy: ListResultsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
      order: ListResultsRequest.OrderDirection.ORDER_DIRECTION_ASC,
      filter: {} as ListResultsRequest.Filter,
    });
    expect(result).toEqual({
      page: undefined,
      pageSize: undefined,
      orderBy: undefined,
      order: undefined,
      createdAfter: undefined,
      createdBefore: undefined,
      status: undefined,
      name: undefined,
      ownerTaskId: undefined,
      sessionId: undefined,
    });
  });

  it('should create a request query', () => {
    const result = service.createListRequestQueryParams({
      page: 2,
      pageSize: 50,
      orderBy: ListResultsRequest.OrderByField.ORDER_BY_FIELD_SESSION_ID,
      order: ListResultsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      filter: {
        sessionId: 'Some test sessionId',
      } as ListResultsRequest.Filter,
    });
    expect(result).toEqual({
      page: 2,
      pageSize: 50,
      orderBy: 1,
      order: 2,
      sessionId: 'Some test sessionId',
      createdAfter: undefined,
      createdBefore: undefined,
      status: undefined,
      name: undefined,
      ownerTaskId: undefined,
    });
  });

  it('should create a default list of request options', () => {
    const result = service.createListRequestOptions({
      page: 0,
      pageSize: 10,
      orderBy: ListResultsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
      order: ListResultsRequest.OrderDirection.ORDER_DIRECTION_ASC,
      filter: {} as ListResultsRequest.Filter,
    });
    expect(result).toEqual(
      new ListResultsRequest({
        page: 0,
        pageSize: 10,
        sort: {
          field: ListResultsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
          direction: ListResultsRequest.OrderDirection.ORDER_DIRECTION_ASC,
        },
        filter: {
          name: '',
          ownerTaskId: '',
          sessionId: '',
          status: 0,
        },
      })
    );
  });

  it('should create a list of request options', () => {
    const result = service.createListRequestOptions({
      page: 2,
      pageSize: 50,
      orderBy: ListResultsRequest.OrderByField.ORDER_BY_FIELD_SESSION_ID,
      order: ListResultsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      filter: {
        sessionId: 'Some test sessionId',
      } as ListResultsRequest.Filter,
    });
    expect(result).toEqual(
      new ListResultsRequest({
        page: 2,
        pageSize: 50,
        sort: {
          field: ListResultsRequest.OrderByField.ORDER_BY_FIELD_SESSION_ID,
          direction: ListResultsRequest.OrderDirection.ORDER_DIRECTION_DESC,
        },
        filter: {
          name: '',
          ownerTaskId: '',
          sessionId: 'Some test sessionId',
          status: 0,
        },
      })
    );
  });
});
