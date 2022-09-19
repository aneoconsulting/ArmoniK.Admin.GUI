import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { ErrorService, TasksService } from '../../../../../../core';
import { GetTaskResponse } from '../../../../../../core/types/proto/tasks-common.pb';

@Injectable()
export class TaskDetailResolver implements Resolve<GetTaskResponse | null> {
  constructor(
    private errorService: ErrorService,
    private taskService: TasksService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<GetTaskResponse | null> {
    return this.taskService
      .getOne(route.paramMap.get('task') ?? '')
      .pipe(catchError((error) => this.errorService.handleError(route, error)));
  }
}
