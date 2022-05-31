import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { catchError, Observable } from 'rxjs';
import { Task } from '../../entities';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private url = 'api/tasks';

  constructor(private http: HttpClient, private errorsService: ErrorsService) {}

  /**
   * Used to get the list of tasks from the api using pagination and filters
   *
   * @param page Page number
   * @param limit Number of items per page
   * @param sessionId Id of the session
   *
   * @returns Pagination of tasks
   */
  getAllPaginated(
    sessionId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<Pagination<Task>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      sessionId,
    });

    return this.http
      .get<Pagination<Task>>(`${this.url}?${params.toString()}`)
      .pipe(
        catchError(this.errorsService.handleError('getAllPaginated', sessionId))
      );
  }

  /**
   * Used to get one task by id
   *
   * @param id Id of the task
   *
   * @returns Task
   */
  getOne(id: string): Observable<Task> {
    return this.http
      .get<Task>(`${this.url}/${id}`)
      .pipe(catchError(this.errorsService.handleError('getOne', id)));
  }
}
