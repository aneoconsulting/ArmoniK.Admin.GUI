import { SortDirection as ArmoniKSortDirection, CancelTasksRequest, CancelTasksResponse, CountTasksByStatusRequest, CountTasksByStatusResponse, GetTaskRequest, GetTaskResponse, ListTasksRequest, ListTasksResponse, TaskStatus, TaskSummary, TaskSummaryField, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { UtilsService } from '@services/utils.service';
import { TaskSummaryFieldKey, TaskSummaryFilter, TaskSummaryListOptions } from '../types';

@Injectable()
export class TasksGrpcService {
  readonly #utilsService = inject(UtilsService<TaskSummary>);
  readonly #tasksClient = inject(TasksClient);

  readonly sortDirections: Record<SortDirection, ArmoniKSortDirection> = {
    'asc': ArmoniKSortDirection.SORT_DIRECTION_ASC,
    'desc': ArmoniKSortDirection.SORT_DIRECTION_DESC,
    '': ArmoniKSortDirection.SORT_DIRECTION_UNSPECIFIED
  };

  readonly sortFields: Record<TaskSummaryFieldKey, TaskSummaryField> = {
    id: TaskSummaryField.TASK_SUMMARY_FIELD_TASK_ID,
    sessionId: TaskSummaryField.TASK_SUMMARY_FIELD_SESSION_ID,
    ownerPodId: TaskSummaryField.TASK_SUMMARY_FIELD_OWNER_POD_ID,
    initialTaskId: TaskSummaryField.TASK_SUMMARY_FIELD_INITIAL_TASK_ID,
    status: TaskSummaryField.TASK_SUMMARY_FIELD_STATUS,
    createdAt: TaskSummaryField.TASK_SUMMARY_FIELD_CREATED_AT,
    submittedAt: TaskSummaryField.TASK_SUMMARY_FIELD_SUBMITTED_AT,
    startedAt: TaskSummaryField.TASK_SUMMARY_FIELD_STARTED_AT,
    endedAt: TaskSummaryField.TASK_SUMMARY_FIELD_ENDED_AT,
    creationToEndDuration: TaskSummaryField.TASK_SUMMARY_FIELD_CREATION_TO_END_DURATION,
    processingToEndDuration: TaskSummaryField.TASK_SUMMARY_FIELD_PROCESSING_TO_END_DURATION,
    podTtl: TaskSummaryField.TASK_SUMMARY_FIELD_POD_TTL,
    podHostname: TaskSummaryField.TASK_SUMMARY_FIELD_POD_HOSTNAME,
    receivedAt: TaskSummaryField.TASK_SUMMARY_FIELD_RECEIVED_AT,
    acquiredAt: TaskSummaryField.TASK_SUMMARY_FIELD_ACQUIRED_AT,
    options: TaskSummaryField.TASK_SUMMARY_FIELD_UNSPECIFIED,
    statusMessage: TaskSummaryField.TASK_SUMMARY_FIELD_UNSPECIFIED,
    countDataDependencies: TaskSummaryField.TASK_SUMMARY_FIELD_UNSPECIFIED,
    countExpectedOutputIds: TaskSummaryField.TASK_SUMMARY_FIELD_UNSPECIFIED,
    countParentTaskIds: TaskSummaryField.TASK_SUMMARY_FIELD_UNSPECIFIED,
    countRetryOfIds: TaskSummaryField.TASK_SUMMARY_FIELD_UNSPECIFIED,
    error: TaskSummaryField.TASK_SUMMARY_FIELD_UNSPECIFIED,
  };

  list$(options: TaskSummaryListOptions, filters: TaskSummaryFilter[]): Observable<ListTasksResponse> {
    const findFilter = this.#utilsService.findFilter;

    const status = this.#utilsService.convertFilterValueToStatus<TaskStatus>(findFilter(filters, 'status'));

    const listTasksRequest = new ListTasksRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: this.sortDirections[options.sort.direction],
        field: {
          taskOptionField: null as any,
          taskSummaryField: this.sortFields[options.sort.active] ?? TaskSummaryField.TASK_SUMMARY_FIELD_TASK_ID
        }
      },
      filter: {
        sessionId: this.#utilsService.convertFilterValue(findFilter(filters, 'sessionId')),
        // initialTaskId: this.#utilsService.convertFilterValue(findFilter(filters, 'initialTaskId')),
        status:  status ? [status] : [],
      }
    });

    return this.#tasksClient.listTasks(listTasksRequest);
  }

  get$(taskId: string): Observable<GetTaskResponse> {
    const getTaskRequest = new GetTaskRequest({
      taskId
    });

    return this.#tasksClient.getTask(getTaskRequest);
  }

  cancel$(tasksIds: string[]): Observable<CancelTasksResponse> {
    const request = new CancelTasksRequest({
      // TODO: upstream typo in armonik.api.angular
      taskIds: tasksIds
    });

    return this.#tasksClient.cancelTasks(request);
  }

  countByStatu$(): Observable<CountTasksByStatusResponse> {
    const request = new CountTasksByStatusRequest();
    return this.#tasksClient.countTasksByStatus(request);
  }
}
