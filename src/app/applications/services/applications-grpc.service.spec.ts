import { ApplicationRawEnumField, ApplicationsClient, FilterStringOperator, ListApplicationsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FilterDefinitionRootString } from '@app/types/filter-definition';
import { UtilsService } from '@services/utils.service';
import { ApplicationsFiltersService } from './applications-filters.service';
import { ApplicationsGrpcService } from './applications-grpc.service';
import { ApplicationRaw, ApplicationRawFilters, ApplicationRawListOptions } from '../types';

describe('ApplicationsGrpcService', () => {
  let service: ApplicationsGrpcService;

  const mockApplicationFiltersService = {
    filtersDefinitions: [
      {
        for: 'root',
        field: 1,
        type: 'string'
      },
      {
        for: 'root',
        field: 2,
        type: 'number'
      } as unknown as FilterDefinitionRootString<ApplicationRawEnumField>
    ]
  };
  
  const mockApplicationsClient = {
    listApplications: jest.fn().mockImplementation((data) => data)
  };

  const options: ApplicationRawListOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'version',
      direction: 'asc'
    }
  };

  const correctfilters: ApplicationRawFilters = [[
    {
      field: 1,
      for: 'root',
      operator: 0,
      value: 'someValue'
    }
  ]];

  const uncorrectfilters: ApplicationRawFilters = [[
    {
      field: 2,
      for: 'root',
      operator: 0,
      value: 123
    }
  ]];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ApplicationsGrpcService,
        UtilsService<ApplicationRawEnumField>,
        { provide: ApplicationsClient, useValue: mockApplicationsClient },
        { provide: ApplicationsFiltersService, useValue: mockApplicationFiltersService }
      ]
    }).inject(ApplicationsGrpcService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should create a request without filters', () => {
    const listResult = new ListApplicationsRequest({
      page: 0,
      pageSize: 10,
      sort: {
        direction: 1,
        fields: [{
          applicationField: {
            field: 2
          }
        }]
      },
      filters: {or: []}
    });
    expect(service.list$(options, [])).toEqual(listResult);
  });

  it('should create a request with filters', () => {
    const listResult = new ListApplicationsRequest({
      page: 0,
      pageSize: 10,
      sort: {
        direction: 1,
        fields: [{
          applicationField: {
            field: 2
          }
        }]
      },
      filters: { or: [{
        and: [{
          field: {
            applicationField: {
              field: 1
            }
          },
          filterString: {
            value: 'someValue',
            operator: 0 as FilterStringOperator
          }
        }]
      }]}
    });
    expect(service.list$(options, correctfilters)).toEqual(listResult);
  });

  it('should throw error in case on unexpected type', () => {
    expect(() => {service.list$(options, uncorrectfilters);}).toThrow('Type number not supported');
  });

  it('should throw error in case on unexpected sort field', () => {
    options.sort.active = 'unexpected' as unknown as keyof ApplicationRaw;
    expect(() => {service.list$(options, []);}).toThrow('Sort field "unexpected" not supported');
  });

  describe('getSortFieldsArray', () => {
    const requestObject = {
      page: 0,
      pageSize: 10,
      sort: {
        direction: 1,
        fields: [] as {applicationField: {field: ApplicationRawEnumField}}[],
      },
      filters: {or: []}
    };

    it('should create the correct sorting field for "name"', () => {
      options.sort.active = 'name';
      requestObject.sort.fields = [
        {
          applicationField: {
            field: 1
          }
        },
        {
          applicationField: {
            field: 2
          }
        }
      ];
      expect(service.list$(options, [])).toEqual(new ListApplicationsRequest(requestObject));
    });

    it('should create the correct sorting field for "version"', () => {
      options.sort.active = 'version';
      requestObject.sort.fields = [{
        applicationField: {
          field: 2
        }
      }];
      expect(service.list$(options, [])).toEqual(new ListApplicationsRequest(requestObject));
    });
  
    it('should create the correct sorting field for "namespace"', () => {
      options.sort.active = 'namespace';
      requestObject.sort.fields = [{
        applicationField: {
          field: 3
        }
      }];
      expect(service.list$(options, [])).toEqual(new ListApplicationsRequest(requestObject));
    });
  
    it('should create the correct sorting field for "service"', () => {
      options.sort.active = 'service';
      requestObject.sort.fields = [{
        applicationField: {
          field: 4
        }
      }];
      expect(service.list$(options, [])).toEqual(new ListApplicationsRequest(requestObject));
    });

    it('should throw error in case of an unexpected sort field', () => {
      options.sort.active = 'unexpected' as unknown as keyof ApplicationRaw;
      expect(() => {service.list$(options, []);}).toThrow('Sort field "unexpected" not supported');
    });
  });
});