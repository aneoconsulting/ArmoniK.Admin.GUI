import { CountTasksByStatusRequest, CountTasksByStatusResponse, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TaskGrpcService {
  constructor(
    private _tasksClient: TasksClient,
  ) {}

  countByStatu$(): Observable<CountTasksByStatusResponse> {
    const request = new CountTasksByStatusRequest();
    return this._tasksClient.countTasksByStatus(request);
  }
}
