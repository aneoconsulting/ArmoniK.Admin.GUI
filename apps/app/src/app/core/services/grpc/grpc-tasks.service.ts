import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ListTasksRequest,
  ListTasksResponse,
} from '../../types/proto/tasks-common.pb';
import { TasksClient } from '../../types/proto/tasks-service.pbsc';

@Injectable()
export class GrpcTasksService {
  constructor(private _tasksClient: TasksClient) {}

  public list$(params: HttpParams): Observable<ListTasksResponse> {
    const options = new ListTasksRequest({
      page: 0,
      pageSize: 10,
      sort: {
        field: ListTasksRequest.OrderByField.ORDER_BY_FIELD_STARTED_AT,
        direction: ListTasksRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
      filter: {},
    });

    return this._tasksClient.listTasks(options);
  }
}
