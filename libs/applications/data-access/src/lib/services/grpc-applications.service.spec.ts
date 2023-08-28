import { TestBed } from '@angular/core/testing';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import {
  ClrDatagridComparatorInterface,
  ClrDatagridStateInterface,
} from '@clr/angular';
import { GrpcCoreModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { GrpcApplicationsService } from './grpc-applications.service';
import {
  ApplicationFilters,
  ApplicationRawEnumField,
  ApplicationsClient,
  FilterStringOperator,
  ListApplicationsRequest,
  SortDirection,
} from '@aneoconsultingfr/armonik.api.angular';

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
        orderBy: [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME],
        order: 1,
        filter: {} as ApplicationFilters,
      });
    });

    it('should create a list of specified request params', () => {
      const state: ClrDatagridStateInterface = {
        page: {
          current: 2,
          size: 50,
        },
        sort: {
          by: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE as unknown as ClrDatagridComparatorInterface<number>,
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
      console.log(requestParams);
      expect(requestParams).toEqual({
        page: 1,
        pageSize: 50,
        orderBy: [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE],
        order: 2,
        filter: {
          name: 'Some test name',
        },
      });
    });

    it('should create a default request query', () => {
      const result = service.createListRequestQueryParams(
        {
          page: 0,
          pageSize: 10,
          orderBy: [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME],
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
          orderBy: [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE],
          order: SortDirection.SORT_DIRECTION_DESC,
          filter: {
            name: 'Some test name',
          },
        },
        30000
      );
      expect(result).toEqual({
        page: 2,
        pageSize: 50,
        interval: 30000,
        orderBy: [3],
        order: 2,
        name: 'Some test name',
      });
    });

    it('should create a default list of request options', () => {
      const result = service.createListRequestOptions({
        page: 0,
        pageSize: 10,
        orderBy: [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME],
        order: SortDirection.SORT_DIRECTION_ASC,
        filter: {},
      });
      expect(result).toEqual(
        new ListApplicationsRequest({
          page: 0,
          pageSize: 10,
          sort: {
            fields: [
              {
                applicationField: {
                  field:  ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME
                },
              },
            ],
            direction: SortDirection.SORT_DIRECTION_ASC,
          },
          filters: {
            or: [{
              and: [],
            }]
          },
        })
      );
    });

    it('should create a list of request options', () => {
      const result = service.createListRequestOptions({
        page: 2,
        pageSize: 50,
        orderBy: [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE],
        order: SortDirection.SORT_DIRECTION_DESC,
        filter: {
          name: 'Some test name',
        },
      });
      expect(result).toEqual(
        new ListApplicationsRequest({
          page: 2,
          pageSize: 50,
          sort: {
            fields: [
              {
                applicationField: {
                  field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE
                },
              },
            ],
            direction: SortDirection.SORT_DIRECTION_DESC,
          },
          filters: {
            or: [{
              and: [
                {
                  field: {
                    applicationField: {
                      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME
                    }
                  },
                  filterString: {
                    operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
                    value: 'Some test name',
                  }
                }
              ],
            }]
          },
        })
      );
    });
});