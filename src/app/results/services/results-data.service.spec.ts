import { ResultRawEnumField, ListResultsResponse, FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
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
import ResultsDataService from './results-data.service';
import { ResultRaw } from '../types';
import { ResultsGrpcService } from './results-grpc.service';

describe('ResultsDataService', () => {
  let service: ResultsDataService;

  const cachedResults = { results: [{ resultId: 'result1' }, { resultId: 'result2' }], total: 2 }  as unknown as ListResultsResponse;
  const mockCacheService = {
    get: jest.fn(() => cachedResults),
    save: jest.fn(),
  };

  const results = { results: [{ resultId: 'result1' }, { resultId: 'result2' }, { resultId: 'result3' }], total: 3 } as unknown as ListResultsResponse;
  const mockResultsGrpcService = {
    list$: jest.fn(() => of(results)),
  };

  const mockNotificationService = {
    success: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
  };

  const initialOptions: ListOptions<ResultRaw> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'desc'
    }
  };

  const initialFilters: FiltersOr<ResultRawEnumField> = [
    [
      {
        field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'name'
      }
    ],
    [
      {
        field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: 'result'
      }
    ]
  ];

  const mockInvertFilterService = {
    invert: jest.fn((e) => e),
  };
  
  const groupConditions: GroupConditions<ResultRawEnumField>[] = [
    {
      name: 'Group 1',
      conditions: [
        [
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 't'
          },
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            value: 'p',
          },
        ],
        [
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID,
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
        ResultsDataService,
        FiltersService,
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: CacheService, useValue: mockCacheService },
        { provide: InvertFilterService, useValue: mockInvertFilterService },
      ]
    }).inject(ResultsDataService);
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
            resultId: 'result1'
          }
        },
        {
          raw: {
            resultId: 'result2'
          }
        },
      ]);
    });

    it('should set the total cached data', () => {
      expect(service.total()).toEqual(cachedResults.total);
    });
  });

  describe('Fetching data', () => {
    it('should list the data', () => {
      service.refresh$.next();
      expect(mockResultsGrpcService.list$).toHaveBeenCalledWith(service.prepareOptions(), service.preparefilters());
    });

    it('should update the total', () => {
      service.refresh$.next();
      expect(service.total()).toEqual(results.total);
    });

    it('should update the data', () => {
      service.refresh$.next();
      expect(service.data()).toEqual([
        {
          raw: {
            resultId: 'result1'
          }
        },
        {
          raw: {
            resultId: 'result2'
          }
        },
        {
          raw: {
            resultId: 'result3'
          }
        }
      ]);
    });

    it('should handle an empty DataRaw', () => {
      const emptyResults = { results: undefined, total: 0 } as unknown as ListResultsResponse;
      mockResultsGrpcService.list$.mockReturnValueOnce(of(emptyResults));
      service.refresh$.next();
      expect(service.data()).toEqual([]);
    });

    it('should catch errors', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockResultsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should notify errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockResultsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
      service.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should cache the raw data', () => {
      service.refresh$.next();
      expect(mockCacheService.save).toHaveBeenCalledWith(service.scope, results);
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
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 't'
          },
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            value: 'p',
          },
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
            value: 'name'
          }
        ],
        [
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 'test'
          },
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
            value: 'name'
          }
        ],
        [
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 't'
          },
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            value: 'p',
          },
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: 'result'
          }
        ],
        [
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            value: 'test'
          },
          {
            field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME,
            for: 'root',
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: 'result'
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
          expect(mockResultsGrpcService.list$).toHaveBeenCalledWith(
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
          expect(group.total).toEqual(results.total);
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
    const toDeleteCondition: GroupConditions<ResultRawEnumField> = {
      name: 'ToBeDeleted',
      conditions: []
    };
    
    const dialogResult: ManageGroupsTableDialogResult<ResultRawEnumField> = {
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