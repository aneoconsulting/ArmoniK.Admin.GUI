import { Injectable } from '@angular/core';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Observable } from 'rxjs';
import { Task } from '../../models';
import { ApiService } from './api.service';

/**
 * Used to communicate with the API for tasks
 */
@Injectable()
export class TasksService {
  private url = '/api/tasks';

  constructor(private apiService: ApiService) {}

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

    return this.apiService.get<Pagination<Task>>(
      `${this.url}?${params.toString()}`
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
    return this.apiService.get<Task>(`${this.url}/${encodeURIComponent(id)}`);
  }
}
