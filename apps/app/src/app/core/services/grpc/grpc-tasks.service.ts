import { Injectable } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { GrpcParams } from '../../types/grpc-params.type';
import {
  CancelTasksRequest,
  CancelTasksResponse,
  GetTaskRequest,
  GetTaskResponse,
  ListTasksRequest,
  ListTasksResponse,
} from '../../types/proto/tasks-common.pb';
import { TasksClient } from '../../types/proto/tasks-service.pbsc';
import { TaskFilter } from '../../types/task-filter.type';
import { BaseGrpcService } from './base-grpc.service';

@Injectable()
export class GrpcTasksService extends BaseGrpcService {
  constructor(private _tasksClient: TasksClient) {
    super();
  }

  // public urlToGrpcParams(
  //   urlParams: Record<string, string | number>
  // ): GrpcParams<
  //   ListSessionsRequest.OrderByField,
  //   ListSessionsRequest.OrderDirection,
  //   TaskFilter
  // > {
  //   const grpcParams: GrpcParams<
  //     ListSessionsRequest.OrderByField,
  //     ListSessionsRequest.OrderDirection,
  //     TaskFilter
  //   > = {};
  //   const filter: TaskFilter = {};

  //   for (const [key, value] of Object.entries(urlParams)) {
  //     if (key === 'page') {
  //       grpcParams.page = value as number;
  //     } else if (key === 'pageSize') {
  //       grpcParams.pageSize = value as number;
  //     } else if (key === 'order') {
  //       grpcParams.order = value as number;
  //     } else if (key === 'orderBy') {
  //       grpcParams.orderBy = value as number;
  //     } else {
  //       if (key === 'id') {
  //         filter.sessionId = value as string;
  //       } else if (key === 'sessionId') {
  //         filter.sessionId = value as string;
  //       } else if (key === 'status') {
  //         filter.status = value as number[];
  //       } else if (key === 'createdAtBefore') {
  //         filter.createdBefore = this.createTimeFilter(value as number);
  //       } else if (key === 'createdAtAfter') {
  //         // The date filter is giving a date on day to soon for the "afters" values. So we had a day.
  //         filter.createdAfter = this.createTimeFilter(
  //           (value as number) + 86400000
  //         );
  //       } else if (key === 'startedAtBefore') {
  //         filter.startedBefore = this.createTimeFilter(value as number);
  //       } else if (key === 'startedAtAfter') {
  //         filter.startedAfter = this.createTimeFilter(
  //           (value as number) + 86400000
  //         );
  //       } else if (key === 'endedAtBefore') {
  //         filter.endedBefore = this.createTimeFilter(value as number);
  //       } else if (key === 'endedAtAfter') {
  //         filter.endedAfter = this.createTimeFilter(
  //           (value as number) + 86400000
  //         );
  //       }
  //     }
  //   }
  //   grpcParams.filter = filter;
  //   return grpcParams;
  // }

  public list$(
    params: GrpcParams<
      ListTasksRequest.OrderByField,
      ListTasksRequest.OrderDirection
      // TaskFilter
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
      filter: {},
      // filter: params.filter,
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
