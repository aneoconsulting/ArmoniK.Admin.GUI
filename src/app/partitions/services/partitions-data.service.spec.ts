import { FilterArrayOperator, FilterNumberOperator, FilterStringOperator, ListPartitionsResponse, PartitionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
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
import PartitionsDataService from './partitions-data.service';
import { PartitionsGrpcService } from './partitions-grpc.service';
import { PartitionRaw } from '../types';

describe('PartitionsDataService', () => {
  let service: PartitionsDataService;

  const cachedPartitions = { partitions: [{ id: 'partition1' }, { id: 'partition2', }], total: 2 } as unknown as ListPartitionsResponse;
  const mockCacheService = {
    get: jest.fn(() => cachedPartitions),
    save: jest.fn(),
  };

  const partitions = { partitions: [{ id: 'partition1' }, { id: 'partition2', }, { id: 'partition3', }], total: 3 }  as unknown as ListPartitionsResponse;
  const mockPartitionsGrpcService = {
    list$: jest.fn(() => of(partitions)),
  };

  const mockNotificationService = {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  const initialOptions: ListOptions<PartitionRaw> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'id',
      direction: 'desc'
    }
  };

  const initialFilters: FiltersOr<PartitionRawEnumField> = [
    [
      {
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'id',
      },
    ],
    [
      {
        field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
        for: 'root',
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
        value: 'test'
      }
    ]
  ];

  const mockInvertFilterService = {
    invert: jest.fn((e) => e),
  };

  const groupConditions: GroupConditions<PartitionRawEnumField>[] = [
    {
      name: 'Group 1',
      conditions: [
        [
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 't'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            value: 'p',
          },
        ],
        [
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
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
        PartitionsDataService,
        FiltersService,
        { provide: PartitionsGrpcService, useValue: mockPartitionsGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: CacheService, useValue: mockCacheService },
        { provide: InvertFilterService, useValue: mockInvertFilterService },
      ]
    }).inject(PartitionsDataService);
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
            id: 'partition1',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition1',
          },
          filters: [[
            { 
              for: 'options',
              field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
              operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
              value: 'partition1'
            },
          ]]
        },
        {
          raw: {
            id: 'partition2',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition2',
          },
          filters: [[
            {
              for: 'options',
              field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
              operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
              value: 'partition2'
            },
          ]]
        },
      ]);
    });

    it('should set the total cached data', () => {
      expect(service.total()).toEqual(cachedPartitions.total);
    });
  });

  describe('Fetching data', () => {
    it('should list the data', () => {
      service.refresh$.next();
      expect(mockPartitionsGrpcService.list$).toHaveBeenCalledWith(service.prepareOptions(), service.preparefilters());
    });
    
    it('should update the total', () => {
      service.refresh$.next();
      expect(service.total()).toEqual(partitions.total);
    });

    it('should update the data', () => {
      service.refresh$.next();
      expect(service.data()).toEqual([
        {
          raw: {
            id: 'partition1',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition1',
            '0-options-4-2': 'id',
            '1-options-3-0': 'test',
            '1-options-4-0': 'partition1',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition1' },
          ]]
        },
        {
          raw: {
            id: 'partition2',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition2',
            '0-options-4-2': 'id',
            '1-options-3-0': 'test',
            '1-options-4-0': 'partition2',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition2' },
          ]]
        },
        {
          raw: {
            id: 'partition3',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition3',
            '0-options-4-2': 'id',
            '1-options-3-0': 'test',
            '1-options-4-0': 'partition3',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition3' },
          ]]
        }
      ]);
    });

    it('should handle an empty DataRaw', () => {
      const partitions = { partitions: undefined, total: 0} as unknown as ListPartitionsResponse;
      mockPartitionsGrpcService.list$.mockReturnValueOnce(of(partitions));
      service.refresh$.next();
      expect(service.data()).toEqual([]);
    });

    it('should catch errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPartitionsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should notify errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPartitionsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should cache the raw data', () => {
      service.refresh$.next();
      expect(mockCacheService.save).toHaveBeenCalledWith(service.scope, partitions);
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
    expect(service.loading()).toBeFalsy();
  });

  describe('Applying filters', () => {
    const filters: FiltersOr<PartitionRawEnumField> = [
      [
        {
          field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
          value: 'a',
        },
        {
          field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PARENT_PARTITION_IDS,
          for: 'root',
          operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS,
          value: 'partition1',
        },
      ],
      [
        {
          field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
          for: 'root',
          operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
          value: 1, 
        }
      ]
    ];

    it('should apply the filters correctly when transforming the data', () => {
      service.filters = filters;
      service.refresh$.next();
      expect(service.data()).toEqual([
        {
          raw: {
            id: 'partition1',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition1',
            '0-options-4-2': 'a',
            '1-options-4-0': 'partition1',
            '1-options-3-0': '1'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition1' },
          ]]
        },
        {
          raw: {
            id: 'partition2',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition2',
            '0-options-4-2': 'a',
            '1-options-4-0': 'partition2',
            '1-options-3-0': '1'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition2' },
          ]]
        },
        {
          raw: {
            id: 'partition3',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition3',
            '0-options-4-2': 'a',
            '1-options-4-0': 'partition3',
            '1-options-3-0': '1'
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition3' },
          ]]
        }
      ]);
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
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 't'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            value: 'p',
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
            value: 'id',
          },
        ],
        [
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 'test'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
            value: 'id',
          },
        ],
        [
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 't'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            value: 'p',
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
            for: 'root',
            operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
            value: 'test'
          }
        ],
        [
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 'test'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
            for: 'root',
            operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
            value: 'test'
          }
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
          expect(mockPartitionsGrpcService.list$).toHaveBeenCalledWith(
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
          expect(group.total).toEqual(partitions.total);
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
    const toDeleteCondition: GroupConditions<PartitionRawEnumField> = {
      name: 'ToBeDeleted',
      conditions: []
    };
  
    const dialogResult: ManageGroupsTableDialogResult<PartitionRawEnumField> = {
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
});