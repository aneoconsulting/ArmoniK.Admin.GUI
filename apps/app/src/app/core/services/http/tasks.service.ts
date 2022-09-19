import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Observable } from 'rxjs';
import { Task } from '../../models';
import {
  GetTaskRequest,
  GetTaskResponse,
  ListTasksRequest,
  ListTasksResponse,
} from '../../types/proto/tasks-common.pb';
import { TasksClient } from '../../types/proto/tasks-service.pbsc';
import { ApiService } from './api.service';

/**
 * Used to communicate with the API for tasks
 */
@Injectable()
export class TasksService {
  private url = '/api/tasks';

  constructor(
    private apiService: ApiService,
    private grpcTaskClient: TasksClient
  ) {}

  /**
   * Used to get the list of tasks from the api using pagination and filters
   *
   * @param page Page number
   * @param limit Number of items per page
   * @param sessionId Id of the session
   *
   * @returns Pagination of tasks
   */
  getAllPaginated(params: HttpParams): Observable<ListTasksResponse> {
    const options = new ListTasksRequest({
      page: Number(params.get('page')),
      pageSize: Number(params.get('limit')),
      filter: {},
      sort: {
        field: ListTasksRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction: ListTasksRequest.OrderDirection.ORDER_DIRECTION_ASC,
      },
    });

    return this.grpcTaskClient.listTasks(options);
  }

  /**
   * Used to get one task by id
   *
   * @param taskId Id of the task
   *
   * @returns Task
   */
  getOne(taskId: string): Observable<GetTaskResponse> {
    // TODO: must be taskId
    const options = new GetTaskRequest({
      id: taskId,
    });
    return this.grpcTaskClient.getTask(options);
  }

  /**
   * Used to cancel tasks
   *
   * @param tasks Tasks to cancel
   */
  cancelMany(tasks: Task[]): Observable<Task[]> {
    const tasksId = tasks.map((task) => task.id);
    return this.apiService.put<Task[]>(`${this.url}/cancel-many`, { tasksId });
  }
}
