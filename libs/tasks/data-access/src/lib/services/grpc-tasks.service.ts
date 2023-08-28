import {
  CancelTasksRequest,
  CancelTasksResponse,
  GetTaskRequest,
  GetTaskResponse,
  ListTasksRequest,
  ListTasksResponse,
  CountTasksByStatusRequest,
  CountTasksByStatusResponse,
  TasksClient,
  SortDirection,
  TaskSummaryEnumField,
  TaskFilters,
  FilterStatusOperator,
  FilterDateOperator,
  FilterStringOperator,
  TaskStatus,
} from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  GrpcListTasksParams,
  GrpcParamsService,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcTasksService extends BaseGrpcService {
  constructor(
    private _tasksClient: TasksClient,
    private _grpcParamsService: GrpcParamsService
  ) {
    super();
  }

  public createListRequestParams(
    state: ClrDatagridStateInterface
  ): GrpcListTasksParams {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      TaskSummaryEnumField,
      SortDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<Record<string, unknown>>(state);

    return {
      page,
      pageSize,
      orderBy:
        orderBy ?? TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT,
      order,
      filter,
    };
  }

  public createListRequestQueryParams(
    { page, pageSize, orderBy, order, filter }: GrpcListTasksParams,
    refreshInterval: number
  ): Record<string, unknown> {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      interval: refreshInterval !== 10000 ? refreshInterval : undefined,
      orderBy:
        orderBy !== TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT
          ? orderBy
          : undefined,
      order: order !== SortDirection.SORT_DIRECTION_ASC ? order : undefined,
      sessionId: filter?.['sessionId'],
      status: filter?.['status'],
      createdBefore: this._grpcParamsService.getTimeStampSeconds(
        filter?.['createdBefore']
      ),
      createdAfter: this._grpcParamsService.getTimeStampSeconds(
        filter?.['createdAfter']
      ),
      startedBefore: this._grpcParamsService.getTimeStampSeconds(
        filter?.['startedBefore']
      ),
      startedAfter: this._grpcParamsService.getTimeStampSeconds(
        filter?.['startedAfter']
      ),
      endedBefore: this._grpcParamsService.getTimeStampSeconds(
        filter?.['endedBefore']
      ),
      endedAfter: this._grpcParamsService.getTimeStampSeconds(
        filter?.['endedAfter']
      ),
    };
  }

  public createListRequestOptions({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListTasksParams): ListTasksRequest {
    const filters: TaskFilters.AsObject = {
      or: [
        {
          and: [],
        },
      ],
    };

    const keys = Object.keys(filter ?? {});
    const statusKey = 'status';
    const dateKeys = [
      'createdBefore',
      'createdAfter',
      'startedBefore',
      'startedAfter',
      'endedBefore',
      'endedAfter',
    ];

    // ['sessionId', 'status', 'createdBefore', 'createdAfter', 'startedBefore', 'startedAfter', 'endedBefore', 'endedAfter']
    for (const key of keys) {
      let fieldId: TaskSummaryEnumField = 0;
      switch (key) {
        case 'sessionId':
          fieldId = TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID;
          break;
        case 'status':
          fieldId = TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS;
          break;
        case 'createdBefore':
          fieldId = TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT;
          break;
        case 'createdAfter':
          fieldId = TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT;
          break;
        case 'startedBefore':
          fieldId = TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STARTED_AT;
          break;
        case 'startedAfter':
          fieldId = TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STARTED_AT;
          break;
        case 'endedBefore':
          fieldId = TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ENDED_AT;
          break;
        case 'endedAfter':
          fieldId = TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ENDED_AT;
          break;
      }

      if (key === statusKey) {
        const statuses = filter?.[key] as TaskStatus[];

        for (const status of statuses) {
          if (filters.or?.[0].and?.length === 0) {
            filters.or?.[0].and?.push({
              field: {
                taskSummaryField: {
                  field: fieldId,
                },
              },
              filterStatus: {
                operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
                value: status,
              },
            });
          } else {
            filters.or?.push({
              and: [
                {
                  field: {
                    taskSummaryField: {
                      field: fieldId,
                    },
                  },
                  filterStatus: {
                    operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
                    value: status,
                  },
                },
              ],
            });
          }
        }
      } else if (dateKeys.includes(key)) {
        filters.or?.[0].and?.push({
          field: {
            taskSummaryField: {
              field: fieldId,
            },
          },
          filterDate: {
            operator: key.endsWith('Before')
              ? FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL
              : FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
            value: filter?.[key],
          },
        });
      } else {
        filters.or?.[0].and?.push({
          field: {
            taskSummaryField: {
              field: fieldId,
            },
          },
          filterString: {
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: filter?.[key],
          },
        });
      }
    }

    const options = new ListTasksRequest({
      page,
      pageSize,
      sort: {
        field: {
          taskSummaryField: {
            field: orderBy,
          },
        },
        direction: order,
      },
      filters,
    });

    return options;
  }

  public list$(options: ListTasksRequest): Observable<ListTasksResponse> {
    return this._tasksClient.listTasks(options).pipe(takeUntil(this._timeout$));
  }

  public get$(taskId: string): Observable<GetTaskResponse> {
    const options = new GetTaskRequest({
      taskId,
    });

    return this._tasksClient.getTask(options).pipe(takeUntil(this._timeout$));
  }

  public cancel$(taskIds: string[]): Observable<CancelTasksResponse> {
    const options = new CancelTasksRequest({
      taskIds,
    });

    return this._tasksClient
      .cancelTasks(options)
      .pipe(takeUntil(this._timeout$));
  }

  public countTasksByStatus$(): Observable<CountTasksByStatusResponse> {
    const options = new CountTasksByStatusRequest();

    return this._tasksClient
      .countTasksByStatus(options)
      .pipe(takeUntil(this._timeout$));
  }
}
