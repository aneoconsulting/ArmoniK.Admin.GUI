import { TestBed } from '@angular/core/testing';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import {
  ClrDatagridComparatorInterface,
  ClrDatagridStateInterface,
} from '@clr/angular';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcResultsService } from './grpc-results.service';
import {
  FilterStringOperator,
  ListResultsRequest,
  ResultRawEnumField,
  ResultsClient,
  SortDirection,
} from '@aneoconsultingfr/armonik.api.angular';

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
        orderBy: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT,
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
          by: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID as unknown as ClrDatagridComparatorInterface<number>,
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
        orderBy: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
        order: 2,
        filter: {
          sessionId: 'Some test sessionId',
        },
      });
    });

    it('should create a default request query', () => {
      const result = service.createListRequestQueryParams(
        {
          page: 0,
          pageSize: 10,
          orderBy: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT,
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
        createdAfter: undefined,
        createdBefore: undefined,
        status: undefined,
        name: undefined,
        ownerTaskId: undefined,
        sessionId: undefined,
      });
    });

    it('should create a request query', () => {
      const result = service.createListRequestQueryParams(
        {
          page: 2,
          pageSize: 50,
          orderBy: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID,
          order: SortDirection.SORT_DIRECTION_DESC,
          filter: {
            sessionId: 'Some test sessionId',
          },
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
        orderBy: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT,
        order: SortDirection.SORT_DIRECTION_ASC,
        filter: {},
      });
      expect(result).toEqual(
        new ListResultsRequest({
          page: 0,
          pageSize: 10,
          sort: {
            field: {
              resultRawField: {
                field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT
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
        orderBy: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
        order: SortDirection.SORT_DIRECTION_DESC,
        filter: {
          sessionId: 'Some test sessionId',
        },
      });
      expect(result).toEqual(
        new ListResultsRequest({
          page: 2,
          pageSize: 50,
          sort: {
            field: {
              resultRawField: {
                field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID
              },
            },
            direction: SortDirection.SORT_DIRECTION_DESC,
          },
          filters: {
      or: [
        {
          and: [{
            field: {
              resultRawField: {
                field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID
              }
            },
            filterString: {
              value: 'Some test sessionId',
              operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
            }
          }],
        },
      ],
    },
        })
      );
    });
});
