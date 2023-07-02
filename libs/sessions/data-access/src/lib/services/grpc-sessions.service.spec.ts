import { TestBed } from '@angular/core/testing';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import {
  ClrDatagridComparatorInterface,
  ClrDatagridStateInterface,
} from '@clr/angular';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcSessionsService } from './grpc-sessions.service';
import {
  ListSessionsRequest,
  SessionRawField,
  SessionsClient,
  SortDirection,
} from '@aneoconsultingfr/armonik.api.angular';

describe('GrpcSessionsService', () => {
  let service: GrpcSessionsService;

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
      providers: [GrpcSessionsService, SessionsClient, GrpcParamsService],
    });
    service = TestBed.inject(GrpcSessionsService);
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
      orderBy: SessionRawField.SESSION_RAW_FIELD_CREATED_AT,
      order: 1,
      filter: {} as ListSessionsRequest.Filter,
    });
  });

  it('should create a list of specified request params', () => {
    const state: ClrDatagridStateInterface = {
      page: {
        current: 2,
        size: 50,
      },
      sort: {
        by: SessionRawField
          .SESSION_RAW_FIELD_SESSION_ID as unknown as ClrDatagridComparatorInterface<number>,
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
      orderBy: SessionRawField.SESSION_RAW_FIELD_SESSION_ID,
      order: 2,
      filter: {
        sessionId: 'Some test sessionId',
      } as ListSessionsRequest.Filter,
    });
  });

  it('should create a default request query', () => {
    const result = service.createListRequestQueryParams(
      {
        page: 0,
        pageSize: 10,
        orderBy: SessionRawField.SESSION_RAW_FIELD_CREATED_AT,
        order: SortDirection.SORT_DIRECTION_ASC,
        filter: {} as ListSessionsRequest.Filter,
      },
      10000
    );
    expect(result).toEqual({
      page: undefined,
      pageSize: undefined,
      interval: undefined,
      orderBy: undefined,
      order: undefined,
      createdBefore: undefined,
      createdAfter: undefined,
      cancelledBefore: undefined,
      cancelledAfter: undefined,
      sessionId: undefined,
      status: undefined,
    });
  });

  it('should create a request query', () => {
    const result = service.createListRequestQueryParams(
      {
        page: 2,
        pageSize: 50,
        orderBy: SessionRawField.SESSION_RAW_FIELD_SESSION_ID,
        order: SortDirection.SORT_DIRECTION_DESC,
        filter: {
          sessionId: 'Some test sessionId',
        } as ListSessionsRequest.Filter,
      },
      30000
    );
    expect(result).toEqual({
      page: 2,
      pageSize: 50,
      interval: 30000,
      orderBy: 1,
      order: 2,
      sessionId: 'Some test sessionId',
      createdBefore: undefined,
      createdAfter: undefined,
      cancelledBefore: undefined,
      cancelledAfter: undefined,
      status: undefined,
    });
  });

  it('should create a default list of request options', () => {
    const result = service.createListRequestOptions({
      page: 0,
      pageSize: 10,
      orderBy: SessionRawField.SESSION_RAW_FIELD_CREATED_AT,
      order: SortDirection.SORT_DIRECTION_ASC,
      filter: {} as ListSessionsRequest.Filter,
    });
    expect(result).toEqual(
      new ListSessionsRequest({
        page: 0,
        pageSize: 10,
        sort: {
          field: {
            sessionRawField: SessionRawField.SESSION_RAW_FIELD_CREATED_AT,
          },
          direction: SortDirection.SORT_DIRECTION_ASC,
        },
        filter: {
          applicationName: '',
          applicationVersion: '',
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
      orderBy: SessionRawField.SESSION_RAW_FIELD_SESSION_ID,
      order: SortDirection.SORT_DIRECTION_DESC,
      filter: {
        sessionId: 'Some test sessionId',
      } as ListSessionsRequest.Filter,
    });
    expect(result).toEqual(
      new ListSessionsRequest({
        page: 2,
        pageSize: 50,
        sort: {
          field: {
            sessionRawField: SessionRawField.SESSION_RAW_FIELD_SESSION_ID,
          },
          direction: SortDirection.SORT_DIRECTION_DESC,
        },
        filter: {
          applicationName: '',
          applicationVersion: '',
          sessionId: 'Some test sessionId',
          status: 0,
        },
      })
    );
  });
});
