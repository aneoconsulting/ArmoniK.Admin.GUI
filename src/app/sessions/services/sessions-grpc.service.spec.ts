import { CancelSessionRequest, FilterArrayOperator, FilterBooleanOperator, FilterDateOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, GetSessionRequest, ListSessionsRequest, PauseSessionRequest, SessionRawEnumField, SessionStatus, SessionTaskOptionEnumField, SessionsClient, SortDirection } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom, of } from 'rxjs';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { ListOptionsSort } from '@app/types/options';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { UtilsService } from '@services/utils.service';
import { SessionsFiltersService } from './sessions-filters.service';
import { SessionsGrpcService } from './sessions-grpc.service';
import { SessionsStatusesService } from './sessions-statuses.service';
import { SessionFilterDefinition, SessionRaw, SessionRawFilters, SessionRawListOptions } from '../types';

describe('SessionsGrpcService', () => {
  let service: SessionsGrpcService;

  const statusesService = new SessionsStatusesService();

  const mocksessionsFilterService = {
    filtersDefinitions: [
      {
        for: 'options',
        field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES,
        type: 'number'
      },
      {
        for: 'root',
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
        type: 'status',
        statuses: Object.keys(statusesService.statuses).map(status => {
          return {
            key: status,
            value: statusesService.statusToLabel(Number(status)),
          };
        }),
      },
      {
        for: 'root',
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        type: 'date'
      },
      {
        for: 'root', 
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS,
        type: 'array'
      },
      {
        for: 'root',
        field: 'UnexpectedField',
        type: 'unexpected'
      },
      {
        for: 'root',
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_WORKER_SUBMISSION,
        type: 'boolean'
      }
    ] as SessionFilterDefinition[],
  };

  const mockTasksGrpcClient = {
    list$: jest.fn(() => {
      return of({
        tasks: [
          {
            endedAt: '2021-09-01T00:00:00Z',
            createdAt: '2021-08-01T00:00:00Z',
          }
        ]
      });
    })
  };

  const mockSessionsGrpcClient = {
    listSessions: jest.fn(),
    getSession: jest.fn(),
    cancelSession: jest.fn(),
    pauseSession: jest.fn(),
    resumeSession: jest.fn(),
    closeSession: jest.fn(),
    deleteSession: jest.fn(),
  };

  const listOptions: SessionRawListOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'createdAt',
      direction: 'asc'
    }
  };

  const listFilters: SessionRawFilters = [
    [
      {
        field: 'options.options.FastCompute', // Custom type string
        for: 'custom',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: 'true'
      },
      {
        field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES, // Options type number
        for: 'options',
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN,
        value: 1
      },
      {
        for: 'root', // Root type status
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
        value: SessionStatus.SESSION_STATUS_RUNNING
      },
      {
        for: 'root', // Root type array
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS,
        operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS,
        value: 'partitionId'
      }
    ],
    [
      {
        for: 'root', // Root type date
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '2313893210'
      },
      {
        for: 'root', // root type boolean
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_WORKER_SUBMISSION,
        operator: FilterBooleanOperator.FILTER_BOOLEAN_OPERATOR_IS,
        value: true
      }
    ]
  ];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        SessionsGrpcService,
        UtilsService,
        GrpcSortFieldService,
        { provide: SessionsFiltersService, useValue: mocksessionsFilterService },
        { provide: SessionsClient, useValue: mockSessionsGrpcClient },
        { provide: TasksGrpcService, useValue: mockTasksGrpcClient },
      ]
    }).inject(SessionsGrpcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a session', () => {
    const sessionId = '1';
    service.get$(sessionId);
    expect(mockSessionsGrpcClient.getSession).toHaveBeenCalledWith(new GetSessionRequest({
      sessionId
    }));
  });

  it('should list many sessions', () => {
    service.list$(listOptions, listFilters);
    expect(mockSessionsGrpcClient.listSessions).toHaveBeenCalledWith(new ListSessionsRequest({
      page: listOptions.pageIndex,
      pageSize: listOptions.pageSize,
      sort: {
        direction: SortDirection.SORT_DIRECTION_ASC,
        field: {
          sessionRawField: {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT
          }
        }
      },
      filters: {
        or: [
          {
            and: [
              {
                field: {
                  taskOptionGenericField: {
                    field: 'options.options.FastCompute'
                  }
                },
                filterString: {
                  value: 'true',
                  operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
                }
              },
              {
                field: {
                  taskOptionField: {
                    field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES
                  }
                },
                filterNumber: {
                  value: '1',
                  operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN
                }
              },
              {
                field: {
                  sessionRawField: {
                    field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS
                  }
                },
                filterStatus: {
                  value: SessionStatus.SESSION_STATUS_RUNNING,
                  operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL
                }
              },
              {
                field: {
                  sessionRawField: {
                    field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS
                  }
                },
                filterArray: {
                  operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS,
                  value: 'partitionId'
                }
              },
            ]
          },
          {
            and: [
              {
                field: {
                  sessionRawField: {
                    field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT
                  }
                },
                filterDate: {
                  value: {
                    nanos: 0,
                    seconds: '2313893210'
                  },
                  operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL
                }
              },
              {
                field: {
                  sessionRawField: {
                    field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_WORKER_SUBMISSION
                  }
                },
                filterBoolean: {
                  value: true,
                  operator: FilterBooleanOperator.FILTER_BOOLEAN_OPERATOR_IS
                }
              }
            ]
          }
        ]
      }
    }));
  });

  it('should list by a default sort direction', () => {
    const options: SessionRawListOptions = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: null,
        direction: 'desc'
      } as unknown as ListOptionsSort<SessionRaw>
    };
    service.list$(options, []);
    expect(mockSessionsGrpcClient.listSessions).toHaveBeenCalledWith(new ListSessionsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: SortDirection.SORT_DIRECTION_DESC,
        field: {
          sessionRawField: {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT
          }
        }
      },
      filters: {}
    }));
  });

  it('should cancel sessions', () => {
    const sessionId = '1';
    service.cancel$(sessionId);
    expect(mockSessionsGrpcClient.cancelSession).toHaveBeenCalledWith(new CancelSessionRequest({
      sessionId
    }));
  });

  it('should not allow some filters', () => {
    const filters: SessionRawFilters = [
      [
        {
          for: 'root',
          field: 'UnexpectedField',
          operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS,
          value: '2313893210'
        }
      ]
    ];
    expect(() => service.list$(listOptions, filters)).toThrow('Type unexpected not supported');
  });

  it('should pause sessions', () => {
    const sessionId = '1';
    service.pause$(sessionId);
    expect(mockSessionsGrpcClient.pauseSession).toHaveBeenCalledWith(new PauseSessionRequest({
      sessionId
    }));
  });

  it('should resume sessions', () => {
    const sessionId = '1';
    service.resume$(sessionId);
    expect(mockSessionsGrpcClient.resumeSession).toHaveBeenCalledWith(new PauseSessionRequest({
      sessionId
    }));
  });

  it('should close sessions', () => {
    const sessionId = '1';
    service.close$(sessionId);
    expect(mockSessionsGrpcClient.closeSession).toHaveBeenCalledWith(new PauseSessionRequest({
      sessionId
    }));
  });

  it('should delete sessions', () => {
    const sessionId = '1';
    service.delete$(sessionId);
    expect(mockSessionsGrpcClient.deleteSession).toHaveBeenCalledWith(new PauseSessionRequest({
      sessionId
    }));
  });

  describe('get Task data', () => {
    it('should get start task data', () => {
      const sessionId = '1';
      const result = service.getTaskData$(sessionId, 'createdAt', 'desc');
      lastValueFrom(result).then(data => {
        expect(data).toEqual({
          date: '2021-08-01T00:00:00Z',
          sessionId: sessionId
        });
      });
    });

    it('should get end task data', () => {
      const sessionId = '1';
      const result = service.getTaskData$(sessionId, 'endedAt', 'asc');
      lastValueFrom(result).then(data => {
        expect(data).toEqual({
          date: '2021-09-01T00:00:00Z',
          sessionId: sessionId
        });
      });
    });
  });
});