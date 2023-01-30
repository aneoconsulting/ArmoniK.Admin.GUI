import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  CancelTasksRequest,
  CancelTasksResponse,
  GetTaskRequest,
  GetTaskResponse,
  GrpcParams,
  ListTasksRequest,
  ListTasksResponse,
  TasksClient,
} from '@armonik.admin.gui/shared/data-access';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcTasksService extends BaseGrpcService {
  constructor(private _tasksClient: TasksClient) {
    super();
  }

  /**
   * Transform an urlParams into a real GrpcParams object designed for retrieving tasks data
   *
   * @param urlParams Record<string, string | number>
   * @returns GrpcParams<
   *            ListTasksRequest.OrderByField,
   *            ListTasksRequest.OrderDirection,
   *            ListTasksRequest.Filter.AsObject
   *          >
   */
  public urlToGrpcParams(
    urlParams: Record<string, string | number | number[]>
  ): GrpcParams<
    ListTasksRequest.OrderByField,
    ListTasksRequest.OrderDirection,
    ListTasksRequest.Filter.AsObject
  > {
    const grpcParams: GrpcParams<
      ListTasksRequest.OrderByField,
      ListTasksRequest.OrderDirection,
      ListTasksRequest.Filter.AsObject
    > = {};

    const filter: ListTasksRequest.Filter.AsObject = {
      sessionId: '',
      status: [],
    };

    for (const [key, value] of Object.entries(urlParams)) {
      switch (key) {
        case 'page': {
          grpcParams.page = value as number;
          break;
        }
        case 'pageSize': {
          grpcParams.pageSize = value as number;
          break;
        }
        case 'order': {
          grpcParams.order = value as number;
          break;
        }
        case 'orderBy': {
          grpcParams.orderBy = value as number;
          break;
        }
        case 'sessionId': {
          filter.sessionId = value as string;
          break;
        }
        case 'status': {
          filter.status = value as number[];
          break;
        }
        case 'createdAtBefore': {
          filter.createdBefore = this._createTimeFilter(value as number);
          break;
        }
        case 'createdAtAfter': {
          // The date filter is giving a date on day to soon for the "afters" values. So we had a day.
          filter.createdAfter = this._createTimeFilter(
            (value as number) + 86400000
          );
          break;
        }
        case 'startedAtBefore': {
          filter.startedBefore = this._createTimeFilter(value as number);
          break;
        }
        case 'startedAtAfter': {
          filter.startedAfter = this._createTimeFilter(
            (value as number) + 86400000
          );
          break;
        }
        case 'endedAtBefore': {
          filter.endedBefore = this._createTimeFilter(value as number);
          break;
        }
        case 'endedAtAfter': {
          filter.endedAfter = this._createTimeFilter(
            (value as number) + 86400000
          );
          break;
        }
      }
    }
    grpcParams.filter = filter;
    return grpcParams;
  }

  public list$(
    params: GrpcParams<
      ListTasksRequest.OrderByField,
      ListTasksRequest.OrderDirection,
      ListTasksRequest.Filter.AsObject
    >
  ): Observable<ListTasksResponse> {
    const options = new ListTasksRequest({
      page: params.page || 0,
      pageSize: params.pageSize || 10,
      sort: {
        field:
          params.orderBy ||
          ListTasksRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction:
          params.order || ListTasksRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
      filter: params.filter,
    });

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
}
