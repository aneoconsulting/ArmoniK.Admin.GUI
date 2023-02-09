import { TestBed } from '@angular/core/testing';
import {
  ApplicationsClient,
  ListApplicationsRequest,
} from '@aneoconsultingfr/armonik.api';
import {
  ClrDatagridComparatorInterface,
  ClrDatagridStateInterface,
} from '@clr/angular';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcApplicationsService } from './grpc-applications.service';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';

describe('GrpcApplicationsService', () => {
  let service: GrpcApplicationsService;

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
      providers: [
        GrpcApplicationsService,
        ApplicationsClient,
        GrpcParamsService,
      ],
    });
    service = TestBed.inject(GrpcApplicationsService);
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
      orderBy: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
      order: 1,
      filter: {} as ListApplicationsRequest.Filter,
    });
  });

  it('should create a list of specified request params', () => {
    const state: ClrDatagridStateInterface = {
      page: {
        current: 2,
        size: 50,
      },
      sort: {
        by: ListApplicationsRequest.OrderByField
          .ORDER_BY_FIELD_NAMESPACE as unknown as ClrDatagridComparatorInterface<number>,
        reverse: true,
      },
      filters: [
        {
          property: 'name',
          value: 'Some test name',
        },
      ],
    };
    const requestParams = service.createListRequestParams(state);
    expect(requestParams).toEqual({
      page: 1,
      pageSize: 50,
      orderBy: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAMESPACE,
      order: 2,
      filter: {
        name: 'Some test name',
      } as ListApplicationsRequest.Filter,
    });
  });

  it('should create a default request query', () => {
    const result = service.createListRequestQueryParams({
      page: 0,
      pageSize: 10,
      orderBy: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
      order: ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
      filter: {} as ListApplicationsRequest.Filter,
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
      orderBy: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAMESPACE,
      order: ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      filter: {
        name: 'Some test name',
      } as ListApplicationsRequest.Filter,
    });
    expect(result).toEqual({
      page: 2,
      pageSize: 50,
      orderBy: 3,
      order: 2,
      name: 'Some test name',
    });
  });

  it('should create a default list of request options', () => {
    const result = service.createListRequestOptions({
      page: 0,
      pageSize: 10,
      orderBy: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
      order: ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
      filter: {} as ListApplicationsRequest.Filter,
    });
    expect(result).toEqual(
      new ListApplicationsRequest({
        page: 0,
        pageSize: 10,
        sort: {
          field: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
          direction: ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC,
        },
        filter: {
          name: '',
          namespace: '',
          version: '',
          service: '',
        },
      })
    );
  });

  it('should create a list of request options', () => {
    const result = service.createListRequestOptions({
      page: 2,
      pageSize: 50,
      orderBy: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAMESPACE,
      order: ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      filter: {
        name: 'Some test name',
      } as ListApplicationsRequest.Filter,
    });
    expect(result).toEqual(
      new ListApplicationsRequest({
        page: 2,
        pageSize: 50,
        sort: {
          field: ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAMESPACE,
          direction:
            ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_DESC,
        },
        filter: {
          name: 'Some test name',
          namespace: '',
          version: '',
          service: '',
        },
      })
    );
  });
});
