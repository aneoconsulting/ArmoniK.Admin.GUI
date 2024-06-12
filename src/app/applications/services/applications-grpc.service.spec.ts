import { ApplicationRawEnumField, ApplicationsClient, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, ListApplicationsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ListOptionsSort } from '@app/types/options';
import { UtilsService } from '@services/utils.service';
import { ApplicationsFiltersService } from './applications-filters.service';
import { ApplicationsGrpcService } from './applications-grpc.service';
import { ApplicationRaw, ApplicationRawFilters, ApplicationRawListOptions } from '../types';

describe('ApplicationsGrpcService', () => {
  let service: ApplicationsGrpcService;

  const filters: ApplicationRawFilters = [
    [
      {
        field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: 'applicationId'
      },
    ],
    [
      {
        field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
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

  const options: ApplicationRawListOptions = {
    pageIndex: 2,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'asc'
    }
  };

  const mockApplicationsFiltersService = {
    filtersDefinitions: [
      {
        for: 'root',
        field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
        type: 'string'
      },
      {
        for: 'root',
        field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
        type: 'string',
      },
      {
        for: 'root',
        field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
        type: 'status',
      },
    ],
  };

  const mockApplicationsClient = {
    listApplications: jest.fn(),
    getApplication: jest.fn(),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ApplicationsGrpcService,
        UtilsService,
        { provide: ApplicationsFiltersService, useValue: mockApplicationsFiltersService },
        { provide: ApplicationsClient, useValue: mockApplicationsClient }
      ]
    }).inject(ApplicationsGrpcService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should list applications', () => {
    service.list$(options, filters);
    expect(mockApplicationsClient.listApplications).toHaveBeenCalledWith(new ListApplicationsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: 1,
        fields: [{
          applicationField: {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME
          }
        }]
      },
      filters: {
        or: [
          {
            and: [
              {
                field: {
                  applicationField: {
                    field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME
                  }
                },
                filterString: {
                  operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
                  value: 'applicationId'
                }
              },
            ]
          },
          {
            and: [
              {
                field: {
                  applicationField: {
                    field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION
                  }
                },
                filterString: {
                  operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
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
    const filters: ApplicationRawFilters = [[{
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
      for: 'root',
      operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
      value: 0
    }]];
    expect(() => service.list$(options, filters)).toThrow('Type status not supported');
  });

  it('should have a default sort field direction', () => {
    const options: ApplicationRawListOptions = {
      pageIndex: 10,
      pageSize: 10,
      sort: {
        active: null,
        direction: 'asc'
      } as unknown as ListOptionsSort<ApplicationRaw>
    };
    service.list$(options, [[]]);
    expect(mockApplicationsClient.listApplications).toHaveBeenCalledWith(new ListApplicationsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: 1,
        fields: [{
          applicationField: {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME
          }
        }]
      },
      filters: {}
    }));
  });
});