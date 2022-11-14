import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CancelTasksRequest,
  CancelTasksResponse,
} from '../../types/proto/tasks-common.pb';
import { TasksClient } from '../../types/proto/tasks-service.pbsc';

@Injectable()
export class GrpcTasksService {
  constructor(private _tasksClient: TasksClient) {}

  public cancel$(taskIds: string[]): Observable<CancelTasksResponse> {
    const options = new CancelTasksRequest({
      taskIds,
    });

    return this._tasksClient.cancelTasks(options);
  }
}
