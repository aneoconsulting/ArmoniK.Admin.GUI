import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CancelTasksRequest,
  CancelTasksResponse,
  GetTaskRequest,
  GetTaskResponse,
  ListTasksRequest,
  ListTasksResponse,
} from '../../types/proto/tasks-common.pb';
import { TasksClient } from '../../types/proto/tasks-service.pbsc';

@Injectable()
export class GrpcTasksService {
  constructor(private _tasksClient: TasksClient) {}

  public list$(params: HttpParams): Observable<ListTasksResponse> {
    const options = new ListTasksRequest({
      page: Number(params.get('page')) || 0,
      pageSize: Number(params.get('pageSize')) || 10,
      sort: {
        field:
          Number(params.get('orderBy')) ||
          ListTasksRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction:
          Number(params.get('order')) === 1
            ? ListTasksRequest.OrderDirection.ORDER_DIRECTION_ASC
            : ListTasksRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
      filter: {},
    });

    return this._tasksClient.listTasks(options);
  }

  public get$(taskId: string): Observable<GetTaskResponse> {
    const options = new GetTaskRequest({
      taskId,
    });

    return this._tasksClient.getTask(options);
  }

  public cancel$(taskIds: string[]): Observable<CancelTasksResponse> {
    const options = new CancelTasksRequest({
      taskIds,
    });

    return this._tasksClient.cancelTasks(options);
  }
}
