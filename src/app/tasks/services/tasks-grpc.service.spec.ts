import { CancelTasksRequest, CountTasksByStatusRequest, FilterArrayOperator, FilterDateOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, GetTaskRequest, ListTasksRequest, SortDirection, TaskOptionEnumField, TaskStatus, TaskSummaryEnumField, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { UtilsService } from '@services/utils.service';
import { TasksFiltersService } from './tasks-filters.service';
import { TasksGrpcService } from './tasks-grpc.service';
import { TasksStatusesService } from './tasks-statuses.service';
import { TaskFilterDefinition, TaskSummaryFilters, TaskSummaryListOptions } from '../types';

describe('TasksGrpcService', () => {
  let service: TasksGrpcService;

  const statusesService = new TasksStatusesService();

  const mocktasksFilterService = {
    filtersDefinitions: [
      {
        for: 'options',
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES,
        type: 'number'
      },
      {
        for: 'root',
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
        type: 'status',
        statuses: Object.keys(statusesService.statuses).map(status => {
          return {
            key: status,
            value: statusesService.statuses[Number(status) as TaskStatus],
          };
        }),
      },
      {
        for: 'root',
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT,
        type: 'date'
      },
      {
        for: 'root', 
        field: 'ArrayCustom',
        type: 'array' // should not be an allowed filter here
      }
    ] as TaskFilterDefinition[],
  };

  const mockGrpcClient = {
    listTasks: jest.fn(),
    getTask: jest.fn(),
    cancelTasks: jest.fn(),
    countTasksByStatus: jest.fn()
  };

  const listOptions: TaskSummaryListOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'createdAt',
      direction: 'asc'
    }
  };

  const listFilters: TaskSummaryFilters = [
    [
      {
        field: 'options.options.FastCompute', // Custom type string
        for: 'custom',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: 'true'
      },
      {
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES, // Options type number
        for: 'options',
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN,
        value: 1
      },
      {
        for: 'root', // Root type status
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
        value: TaskStatus.TASK_STATUS_CREATING
      }
    ],
    [
      {
        for: 'root', // Root type date
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT,
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '2313893210'
      }
    ]
  ];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksGrpcService,
        UtilsService,
        GrpcSortFieldService,
        { provide: TasksFiltersService, useValue: mocktasksFilterService },
        { provide: TasksClient, useValue: mockGrpcClient }
      ]
    }).inject(TasksGrpcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get a task', () => {
    const taskId = '1';
    service.get$(taskId);
    expect(mockGrpcClient.getTask).toHaveBeenCalledWith(new GetTaskRequest({
      taskId
    }));
  });

  it('should list many tasks', () => {
    service.list$(listOptions, listFilters);
    expect(mockGrpcClient.listTasks).toHaveBeenCalledWith(new ListTasksRequest({
      page: listOptions.pageIndex,
      pageSize: listOptions.pageSize,
      sort: {
        direction: SortDirection.SORT_DIRECTION_ASC,
        field: {
          taskSummaryField: {
            field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT
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
                    field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES
                  }
                },
                filterNumber: {
                  value: '1',
                  operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN
                }
              },
              {
                field: {
                  taskSummaryField: {
                    field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS
                  }
                },
                filterStatus: {
                  value: TaskStatus.TASK_STATUS_CREATING,
                  operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL
                }
              }
            ]
          },
          {
            and: [
              {
                field: {
                  taskSummaryField: {
                    field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT
                  }
                },
                filterDate: {
                  value: {
                    nanos: 0,
                    seconds: '2313893210'
                  },
                  operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL
                }
              }
            ]
          }
        ]
      }
    }));
  });

  it('should count tasks by their status', () => {
    const filters: TaskSummaryFilters = [
      [
        {
          for: 'root',
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT,
          operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
          value: '2313893210'
        }
      ]
    ];
    service.countByStatus$(filters);
    expect(mockGrpcClient.countTasksByStatus).toHaveBeenCalledWith(new CountTasksByStatusRequest({
      filters: {
        or: [{
          and: [
            {
              field: {
                taskSummaryField: {
                  field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT
                }
              },
              filterDate: {
                value: {
                  nanos: 0,
                  seconds: '2313893210'
                },
                operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL
              }
            }
          ]
        }]
      }
    }));
  });

  it('should cancel tasks', () => {
    const tasks = ['1', '2'];
    service.cancel$(tasks);
    expect(mockGrpcClient.cancelTasks).toHaveBeenCalledWith(new CancelTasksRequest({
      taskIds: tasks
    }));
  });

  it('should not allow some filters', () => {
    const filters: TaskSummaryFilters = [
      [
        {
          for: 'root',
          field: 'ArrayCustom',
          operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS,
          value: '2313893210'
        }
      ]
    ];
    expect(() => service.countByStatus$(filters)).toThrow('Type array not supported');
  });
});