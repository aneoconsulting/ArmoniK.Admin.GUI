import { ApplicationRawEnumField, ApplicationsClient, FilterStringOperator, ListApplicationsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FilterDefinitionRootString } from '@app/types/filter-definition';
import { UtilsService } from '@services/utils.service';
import { ApplicationsFiltersService } from './applications-filters.service';
import { ApplicationsGrpcService } from './applications-grpc.service';
import { ApplicationRawFilter, ApplicationRawListOptions } from '../types';

describe('ApplicationsGrpcService', () => {
  let service: ApplicationsGrpcService;

  const mockApplicationFiltersService = {
    retrieveFiltersDefinitions: jest.fn().mockImplementation(() => {
      const definitions: FilterDefinitionRootString<ApplicationRawEnumField>[] = [
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
      ];
      return definitions;
    })
  };
  
  const mockApplicationsClient = {
    listApplications: jest.fn().mockImplementation((data) => data)
  };

  const options: ApplicationRawListOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'asc'
    }
  };

  const correctfilters: ApplicationRawFilter = [[
    {
      field: 1,
      for: 'root',
      operator: 0,
      value: 'someValue'
    }
  ]];

  const uncorrectfilters: ApplicationRawFilter = [[
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

  it('should not get', () => {
    expect(() => {service.get$();}).toThrowError('This method must never be called');
  });

  it('should create a request without filters', () => {
    const listResult = new ListApplicationsRequest({
      page: 0,
      pageSize: 10,
      sort: {
        direction: 1,
        fields: [{
          applicationField: {
            field: 1
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
            field: 1
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
    expect(() => {service.list$(options, uncorrectfilters);}).toThrowError('Type number not supported');
  });
});