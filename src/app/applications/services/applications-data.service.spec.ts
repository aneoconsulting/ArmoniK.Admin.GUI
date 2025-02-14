import { ApplicationRawEnumField, FilterStringOperator, ListApplicationsResponse, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FiltersOr } from '@app/types/filters';
import { GroupConditions } from '@app/types/groups';
import { ListOptions } from '@app/types/options';
import { ManageGroupsTableDialogResult } from '@components/table/group/manage-groups-dialog/manage-groups-dialog.component';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { InvertFilterService } from '@services/invert-filter.service';
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

  const initialFilters: FiltersOr<ApplicationRawEnumField> = [
    [
      {
        field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: 'name',
      },
    ],
    [
      {
        field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
        value: 'service'
      }
    ]
  ];

  const mockInvertFilterService = {
    invert: jest.fn((e) => e),
  };

  const groupConditions: GroupConditions<ApplicationRawEnumField>[] = [
    {
      name: 'Group 1',
      conditions: [
        [
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 't'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            value: 'p',
          },
        ],
        [
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 'test'
          },
        ],
      ]
    }
  ];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ApplicationsDataService,
        FiltersService,
        { provide: ApplicationsGrpcService, useValue: mockApplicationsGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: CacheService, useValue: mockCacheService },
        { provide: InvertFilterService, useValue: mockInvertFilterService },
      ]
    }).inject(ApplicationsDataService);
    service.options = initialOptions;
    service.filters = initialFilters;
    service.groupsConditions.push(...groupConditions);
    service.initGroups();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should load data from the cache', () => {
      expect(service.data()).toEqual([
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
      expect(service.total()).toEqual(cachedApplications.total);
    });

    it('should add groups according to group conditions', () => {
      expect(service.groups.length).toEqual(groupConditions.length);
    });
  });

  describe('Fetching data', () => {
    it('should list the data', () => {
      service.refresh$.next();
      expect(mockApplicationsGrpcService.list$).toHaveBeenCalledWith(service.prepareOptions(), service.preparefilters());
    });

    it('should update the total', () => {
      service.refresh$.next();
      expect(service.total()).toEqual(applications.total);
    });

    it('should update the data', () => {
      service.refresh$.next();
      expect(service.data()).toEqual([
        {
          raw: {
            name: 'application1',
            version: 'version1'
          } as ApplicationRaw,
          queryTasksParams: {
            '0-options-5-0': 'application1',
            '0-options-6-0': 'version1',
            '1-options-5-0': 'application1',
            '1-options-6-0': 'version1',
            '1-options-8-1': 'service',
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
            '0-options-6-0': 'version2',
            '1-options-5-0': 'application2',
            '1-options-6-0': 'version2',
            '1-options-8-1': 'service',
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
            '0-options-6-0': 'version3',
            '1-options-5-0': 'application3',
            '1-options-6-0': 'version3',
            '1-options-8-1': 'service',
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
      expect(service.data()).toEqual([]);
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

  describe('PrepareOptions', () => {
    it('should clone the options', () => {
      expect(service.prepareOptions()).toEqual(initialOptions);
    });
  });

  describe('PrepareFilters', () => {
    it('should merge filters and group conditions', () => {
      (expect(service.preparefilters())).toEqual([
        [
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 't'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            value: 'p',
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: 'name',
          },
        ],
        [
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 'test'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: 'name',
          },
        ],
        [
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 't'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            value: 'p',
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
            value: 'service'
          },
        ],
        [
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 'test'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
            value: 'service'
          },
        ],
      ]);
    });

    it('should return group conditions if there is no filters', () => {
      service.filters = [];
      expect(service.preparefilters()).toEqual(groupConditions[0].conditions);
    });
  });

  describe('groups fetching data', () => {
    describe('defined conditions', () => {
      it('should list data if there is a group condition', () => {
        const group = service.groups[0];
        group.data.subscribe(() => {
          expect(mockApplicationsGrpcService.list$).toHaveBeenCalledWith(
            {
              pageSize: 100,
              pageIndex: group.page,
              sort: initialOptions.sort
            },
            groupConditions[0].conditions
          );
        });
        group.refresh$.next();
      });
  
      it('should update the group total', () => {
        const group = service.groups[0];
        group.data.subscribe(() => {
          expect(group.total).toEqual(applications.total);
        });
        group.refresh$.next();
      });
    });

    describe('empty conditions', () => {
      it('should set emptyCondition to true', () => {
        service.groupsConditions[0].conditions = [];
        const group = service.groups[0];
        group.data.subscribe(() => {
          expect(group.emptyCondition).toBeTruthy();
        });
        group.refresh$.next();
      });

      it('should set total to 0', () => {
        const group = service.groups[0];
        group.data.subscribe(() => {
          expect(group.total).toEqual(0);
        });
        group.refresh$.next();
      });
    });
  });

  describe('manageGroupDialogResult', () => {
    const toDeleteCondition: GroupConditions<ApplicationRawEnumField> = {
      name: 'ToBeDeleted',
      conditions: []
    };

    const dialogResult: ManageGroupsTableDialogResult<ApplicationRawEnumField> = {
      editedGroups: {
        'Group 1': {
          name: 'Renamed Group',
          conditions: [],
        },
      },
      addedGroups: [
        {
          name: 'New Group',
          conditions: [],
        },
      ],
      deletedGroups: [
        'ToBeDeleted',
      ],
    };

    beforeEach(() => {
      service['removeGroup']('New Group');
      service['addGroup'](toDeleteCondition);
      service.manageGroupDialogResult(dialogResult);
    });

    it('should edit the correct group condition', () => {
      expect(service.groupsConditions[0]).toEqual(dialogResult.editedGroups['Group 1']);
    });

    it('should edit the correct group', () => {
      expect(service.groups[0].name()).toEqual(dialogResult.editedGroups['Group 1'].name);
    });

    it('should add a group condition', () => {
      expect(service.groupsConditions[1]).toEqual(dialogResult.addedGroups[0]);
    });

    it('should add a group', () => {
      expect(service.groups[1].name()).toEqual(dialogResult.addedGroups[0].name);
    });

    it('should remove a group condition', () => {
      expect(service.groupsConditions.findIndex((group) => group.name === 'ToBeDeleted')).toEqual(-1);
    });

    it('should remove a group', () => {
      expect(service.groups.findIndex((group) => group.name() === 'ToBeDeleted')).toEqual(-1);
    });
  });

  it('should refresh the correct group', () => {
    const group = service.groups[0];
    const spy = jest.spyOn(group.refresh$, 'next');
    service.refreshGroup(group.name());
    expect(spy).toHaveBeenCalled();
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
    expect(service.loading()).toBeFalsy();
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
      expect(service.data()).toEqual([
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

  describe('on destroy', () => {
    beforeEach(() => {
      service.ngOnDestroy();
    });

    it('should unsubscribe', () => {
      expect(service['dataSubscription'].closed).toBeTruthy();
    });
  });
});