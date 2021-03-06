import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { ErrorService, TasksService, Task } from '../../../../../../core';

@Injectable()
export class TaskDetailResolver implements Resolve<Task | null> {
  constructor(
    private errorService: ErrorService,
    private taskService: TasksService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Task | null> {
    return this.taskService
      .getOne(route.paramMap.get('task') ?? '')
      .pipe(catchError((error) => this.errorService.handleError(route, error)));
  }
}
