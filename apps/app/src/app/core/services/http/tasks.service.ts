import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { Observable } from 'rxjs';
import { Task } from '../../models';
import { TaskStatus } from '../../types/proto/task-status.pb';
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
   * @param params Params of the request
   *
   * @returns Pagination of tasks
   */
  list(params: HttpParams): Observable<ListTasksResponse> {
    console.log('params', params);
    const options = new ListTasksRequest({
      page: Number(params.get('page')),
      pageSize: Number(params.get('limit')),
      // Use OrderByField enum because of Clarity and how it works
      // In fact, the filter field name is the same as the sort field name
      filter: {
        sessionId:
          params.get(
            ListTasksRequest.OrderByField.ORDER_BY_FIELD_SESSION_ID.toString()
          ) ?? undefined,
        status:
          Number(
            params.get(
              ListTasksRequest.OrderByField.ORDER_BY_FIELD_STATUS.toString()
            ) as unknown as TaskStatus
          ) ?? undefined,
      },
      sort: {
        field: params.has('orderBy')
          ? (Number(
              params.get('orderBy')
            ) as unknown as ListTasksRequest.OrderByField)
          : ListTasksRequest.OrderByField.ORDER_BY_FIELD_STARTED_AT,
        direction:
          Number(params.get('order')) === 1
            ? ListTasksRequest.OrderDirection.ORDER_DIRECTION_ASC
            : ListTasksRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
    });
    console.log('options', options);
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
