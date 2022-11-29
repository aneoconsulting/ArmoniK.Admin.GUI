import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empty } from '../../types/proto/objects.pb';
import { TaskFilter } from '../../types/proto/submitter-common.pb';
import { SubmitterClient } from '../../types/proto/submitter-service.pbsc';

@Injectable()
export class GrpcTasksService {
  constructor(private _tasksClient: SubmitterClient) {}

  public cancel$(taskIds: string[]): Observable<Empty> {
    const options = new TaskFilter({
      task: { ids: taskIds },
    });

    return this._tasksClient.cancelTasks(options);
  }
}
