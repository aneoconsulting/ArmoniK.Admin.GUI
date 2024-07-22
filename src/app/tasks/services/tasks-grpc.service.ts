import { CancelTasksRequest, CancelTasksResponse, CountTasksByStatusRequest, CountTasksByStatusResponse, GetTaskRequest, GetTaskResponse, ListTasksRequest, ListTasksResponse, TaskField, TaskFilterField, TaskOptionEnumField, TaskSummaryEnumField, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter, FilterType } from '@app/types/filters';
import { GrpcCancelManyInterface, GrpcCountByStatusInterface, GrpcGetInterface, GrpcTableService, ListDefaultSortField } from '@app/types/services/grpcService';
import { FilterField, buildDateFilter, buildNumberFilter, buildStatusFilter, buildStringFilter } from '@services/grpc-build-request.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { TasksFiltersService } from './tasks-filters.service';
import { TaskOptions, TaskOptionsFieldKey, TaskSummary, TaskSummaryFieldKey, TaskSummaryFilters, TaskSummaryListOptions } from '../types';

@Injectable()
export class TasksGrpcService extends GrpcTableService<TaskSummary, TaskSummaryEnumField, TaskOptions, TaskOptionEnumField>
  implements GrpcGetInterface<GetTaskResponse>, GrpcCancelManyInterface<CancelTasksResponse>, GrpcCountByStatusInterface<TaskSummaryEnumField, TaskOptionEnumField> {
  readonly filterService = inject(TasksFiltersService);
  readonly grpcClient = inject(TasksClient);
  readonly sortFieldService = inject(GrpcSortFieldService);

  readonly sortFields: Record<TaskSummaryFieldKey, TaskSummaryEnumField> = {
    id: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
    sessionId: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
    ownerPodId: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_OWNER_POD_ID,
    initialTaskId: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_INITIAL_TASK_ID,
    status: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
    createdAt: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT,
    submittedAt: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SUBMITTED_AT,
    startedAt: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STARTED_AT,
    endedAt: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ENDED_AT,
    creationToEndDuration: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATION_TO_END_DURATION,
    processingToEndDuration: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_PROCESSING_TO_END_DURATION,
    podTtl: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_TTL,
    podHostname: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_HOSTNAME,
    receivedAt: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_RECEIVED_AT,
    acquiredAt: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ACQUIRED_AT,
    options: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_UNSPECIFIED,
    statusMessage: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_UNSPECIFIED,
    countDataDependencies: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_UNSPECIFIED,
    countExpectedOutputIds: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_UNSPECIFIED,
    countParentTaskIds: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_UNSPECIFIED,
    countRetryOfIds: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_UNSPECIFIED,
    error: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_UNSPECIFIED,
    receivedToEndDuration: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_RECEIVED_TO_END_DURATION,
    fetchedAt: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_FETCHED_AT,
    processedAt: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_PROCESSED_AT,
    payloadId: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_PAYLOAD_ID,
  };

  list$(options: TaskSummaryListOptions, filters: TaskSummaryFilters): Observable<ListTasksResponse> {
    const listTasksRequest = new ListTasksRequest(this.createListRequest(options, filters) as ListTasksRequest);
    return this.grpcClient.listTasks(listTasksRequest);
  }

  get$(taskId: string): Observable<GetTaskResponse> {
    const getTaskRequest = new GetTaskRequest({
      taskId
    });

    return this.grpcClient.getTask(getTaskRequest);
  }

  cancel$(taskIds: string[]): Observable<CancelTasksResponse> {
    const request = new CancelTasksRequest({
      taskIds
    });

    return this.grpcClient.cancelTasks(request);
  }

  countByStatus$(filters: TaskSummaryFilters): Observable<CountTasksByStatusResponse> {

    const requestFilters = this.createFilters(filters, this.filterService.filtersDefinitions) as { or: { and: TaskFilterField.AsObject[] }[] };

    const request = new CountTasksByStatusRequest({
      filters: requestFilters
    });

    return this.grpcClient.countTasksByStatus(request);
  }

  createSortField(field: TaskSummaryFieldKey | TaskOptionsFieldKey): ListDefaultSortField {
    return {
      field: this.sortFieldService.buildSortField(field,
        () => {
          return {
            taskSummaryField: {
              field: this.sortFields[field as TaskSummaryFieldKey] ?? TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT
            }
          } as TaskField;
        }
      )
    };
  }

  createFilterField(field: TaskSummaryEnumField | TaskOptionEnumField | string, isForRoot?: boolean | undefined, isCustom?: boolean | undefined): FilterField {
    if (isForRoot) {
      return {
        taskSummaryField: {
          field: field as TaskSummaryEnumField
        }
      };
    } else if (isCustom) {
      return {
        taskOptionGenericField: {
          field: field as string
        }
      };
    } else {
      return {
        taskOptionField: {
          field: field as TaskOptionEnumField
        }
      };
    }
  }

  buildFilter(type: FilterType, filterField: FilterField, filter: Filter<TaskSummaryEnumField, TaskOptionEnumField>): TaskFilterField.AsObject {
    switch (type) {
    case 'string':
      return buildStringFilter(filterField, filter) as TaskFilterField.AsObject;
    case 'status':
      return buildStatusFilter(filterField, filter) as TaskFilterField.AsObject;
    case 'number':
      return buildNumberFilter(filterField, filter) as TaskFilterField.AsObject;
    case 'date':
      return buildDateFilter(filterField, filter) as TaskFilterField.AsObject;
    default:
      throw new Error(`Type ${type} not supported`);
    }
  }
}
