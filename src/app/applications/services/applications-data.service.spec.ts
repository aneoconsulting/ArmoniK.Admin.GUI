import { ApplicationRawEnumField, FilterStringOperator, ListApplicationsResponse, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { of, throwError } from 'rxjs';
import ApplicationsDataService from './applications-data.service';
import { ApplicationRaw } from '../types';
import { ApplicationsGrpcService } from './applications-grpc.service';

describe('ApplicationDataService', () => {
  let service: ApplicationsDataService;

  const cachedApplications = { applications: [{ name: 'application1', version: 'version1' }, { name: 'application2', version: 'version2' }], total: 2 }  as unknown as ListApplicationsResponse;
  const mockCacheService = {
    get: jest.fn(() => cachedApplications),
    save: jest.fn(),
  };

  const applications = { applications: [{ name: 'application1', version: 'version1' }, { name: 'application2', version: 'version2' }, { name: 'application3', version: 'version3' }], total: 3 }  as unknown as ListApplicationsResponse;
  const mockApplicationsGrpcService = {
    list$: jest.fn(() => of(applications)),
  };

  const mockNotificationService = {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  const initialOptions: ListOptions<ApplicationRaw> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'desc'
    }
  };

  const initialFilters: FiltersOr<ApplicationRawEnumField> = [];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ApplicationsDataService,
        FiltersService,
        { provide: ApplicationsGrpcService, useValue: mockApplicationsGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: CacheService, useValue: mockCacheService },
      ]
    }).inject(ApplicationsDataService);
    service.options = initialOptions;
    service.filters = initialFilters;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should load data from the cache', () => {
      expect(service.data).toEqual([
        {
          raw: {
            name: 'application1',
            version: 'version1'
          } as ApplicationRaw,
          queryTasksParams: {
            '0-options-5-0': 'application1',
            '0-options-6-0': 'version1'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application1' },
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version1' }
          ]]
        },
        {
          raw: {
            name: 'application2',
            version: 'version2'
          } as ApplicationRaw,
          queryTasksParams: {
            '0-options-5-0': 'application2',
            '0-options-6-0': 'version2'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application2' },
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version2' }
          ]]
        }
      ]);
    });

    it('should set the total cached data', () => {
      expect(service.total).toEqual(cachedApplications.total);
    });
  });

  describe('Fetching data', () => {
    it('should list the data', () => {
      service.refresh$.next();
      expect(mockApplicationsGrpcService.list$).toHaveBeenCalledWith(service.options, service.filters);
    });

    it('should update the total', () => {
      service.refresh$.next();
      expect(service.total).toEqual(applications.total);
    });

    it('should update the data', () => {
      service.refresh$.next();
      expect(service.data).toEqual([
        {
          raw: {
            name: 'application1',
            version: 'version1'
          } as ApplicationRaw,
          queryTasksParams: {
            '0-options-5-0': 'application1',
            '0-options-6-0': 'version1'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application1' },
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version1' }
          ]]
        },
        {
          raw: {
            name: 'application2',
            version: 'version2'
          } as ApplicationRaw,
          queryTasksParams: {
            '0-options-5-0': 'application2',
            '0-options-6-0': 'version2'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application2' },
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version2' }
          ]]
        },
        {
          raw: {
            name: 'application3',
            version: 'version3'
          } as ApplicationRaw,
          queryTasksParams: {
            '0-options-5-0': 'application3',
            '0-options-6-0': 'version3'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application3' },
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version3' }
          ]]
        }
      ]);
    });

    it('should handle an empty DataRaw', () => {
      const emptyApplications = { applications: undefined, total: 0 } as unknown as ListApplicationsResponse;
      mockApplicationsGrpcService.list$.mockReturnValueOnce(of(emptyApplications));
      service.refresh$.next();
      expect(service.data).toEqual([]);
    });

    it('should catch errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockApplicationsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should notify errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockApplicationsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should cache the raw data', () => {
      service.refresh$.next();
      expect(mockCacheService.save).toHaveBeenCalledWith(service.scope, applications);
    });
  });

  it('should display a success message', () => {
    const message = 'A success message !';
    service.success(message);
    expect(mockNotificationService.success).toHaveBeenCalledWith(message);
  });

  it('should display a warning message', () => {
    const message = 'A warning message !';
    service.warning(message);
    expect(mockNotificationService.warning).toHaveBeenCalledWith(message);
  });

  it('should display an error message', () => {
    const error: GrpcStatusEvent = {
      statusMessage: 'A error status message'
    } as GrpcStatusEvent;
    jest.spyOn(console, 'error').mockImplementation(() => {});
    service.error(error);
    expect(mockNotificationService.error).toHaveBeenCalledWith(error.statusMessage);
  });

  it('should load correctly', () => {
    expect(service.loading).toBeFalsy();
  });

  describe('Applying filters', () => {
    const filters: FiltersOr<ApplicationRawEnumField> = [
      [
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
          for: 'root',
          value: 'name'
        },
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          for: 'root',
          value: 'service'
        },
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          for: 'root',
          value: 'shouldNotAppearNamespace',
        },
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_UNSPECIFIED,
          operator: null,
          for: 'root',
          value: null
        }
      ],
      [
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_UNSPECIFIED,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
          for: 'root',
          value: 'shouldNotAppear'
        },
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
          for: 'root',
          value: 'version'
        },
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
          for: 'root',
          value: 'namespace',
        },
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          for: 'root',
          value: 'shouldNotAppearName'
        },
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
          operator: null,
          for: 'root',
          value: 'shouldNotAppearService'
        },
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          for: 'root',
          value: null,
        }
      ]
    ];

    it('should apply the filters correctly when transforming the data', () => {
      service.filters = filters;
      service.refresh$.next();
      expect(service.data).toEqual([
        {
          raw: {
            name: 'application1',
            version: 'version1'
          } as ApplicationRaw,
          queryTasksParams: {
            '0-options-5-1': 'name',
            '0-options-8-0': 'service',
            '0-options-5-0': 'application1',
            '0-options-6-0': 'version1',
            '1-options-6-2': 'version',
            '1-options-7-4': 'namespace',
            '1-options-5-0': 'application1',
            '1-options-6-0': 'version1',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application1' },
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version1' }
          ]]
        },
        {
          raw: {
            name: 'application2',
            version: 'version2'
          } as ApplicationRaw,
          queryTasksParams: {
            '0-options-5-1': 'name',
            '0-options-8-0': 'service',
            '0-options-5-0': 'application2',
            '0-options-6-0': 'version2',
            '1-options-6-2': 'version',
            '1-options-7-4': 'namespace',
            '1-options-5-0': 'application2',
            '1-options-6-0': 'version2',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application2' },
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version2' }
          ]]
        },
        {
          raw: {
            name: 'application3',
            version: 'version3'
          } as ApplicationRaw,
          queryTasksParams: {
            '0-options-5-1': 'name',
            '0-options-8-0': 'service',
            '0-options-5-0': 'application3',
            '0-options-6-0': 'version3',
            '1-options-6-2': 'version',
            '1-options-7-4': 'namespace',
            '1-options-5-0': 'application3',
            '1-options-6-0': 'version3',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application3' },
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version3' }
          ]]
        }
      ]);
    });
  });
});