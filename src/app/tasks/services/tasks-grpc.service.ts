import { CancelTasksRequest, CancelTasksResponse, CountTasksByStatusRequest, CountTasksByStatusResponse, FilterDateOperator, FilterNumberOperator, FilterStringOperator, GetTaskRequest, GetTaskResponse, ListTasksRequest, ListTasksResponse, TaskFilterField, TaskOptionEnumField, TaskSummaryEnumField, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter, FilterType } from '@app/types/filters';
import { GrpcCancelManyInterface, GrpcCountByStatusInterface, GrpcGetInterface, GrpcListInterface } from '@app/types/services/grpcService';
import { sortDirections } from '@services/grpc-build-request.service';
import { UtilsService } from '@services/utils.service';
import { TasksFiltersService } from './tasks-filters.service';
import { TaskSummaryField, TaskSummaryFieldKey, TaskSummaryFilters, TaskSummaryListOptions } from '../types';

@Injectable()
export class TasksGrpcService implements GrpcListInterface<TasksClient, TaskSummaryListOptions, TaskSummaryFilters, TaskSummaryFieldKey, TaskSummaryEnumField, TaskOptionEnumField>, GrpcGetInterface<GetTaskResponse>, GrpcCancelManyInterface<CancelTasksResponse>, GrpcCountByStatusInterface<TaskSummaryFilters, TaskSummaryEnumField, TaskOptionEnumField> {
  readonly filterService = inject(TasksFiltersService);
  readonly utilsService = inject(UtilsService<TaskSummaryEnumField, TaskOptionEnumField>);
  readonly grpcClient = inject(TasksClient);

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
  };

  list$(options: TaskSummaryListOptions, filters: TaskSummaryFilters): Observable<ListTasksResponse> {

    const requestFilters = this.utilsService.createFilters<TaskFilterField.AsObject>(filters, this.filterService.filtersDefinitions, this.#buildFilterField);

    const listTasksRequest = new ListTasksRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: sortDirections[options.sort.direction],
        field: {
          taskSummaryField: {
            field: this.sortFields[options.sort.active] ?? TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID
          }
        }
      },
      filters: requestFilters
    });

    return this.grpcClient.listTasks(listTasksRequest);
  }

  get$(taskId: string): Observable<GetTaskResponse> {
    const getTaskRequest = new GetTaskRequest({
      taskId
    });

    return this.grpcClient.getTask(getTaskRequest);
  }

  cancel$(tasksIds: string[]): Observable<CancelTasksResponse> {
    const request = new CancelTasksRequest({
      // TODO: upstream typo in armonik.api.angular
      taskIds: tasksIds
    });

    return this.grpcClient.cancelTasks(request);
  }

  countByStatus$(filters: TaskSummaryFilters): Observable<CountTasksByStatusResponse> {

    const requestFilters = this.utilsService.createFilters<TaskFilterField.AsObject>(filters, this.filterService.filtersDefinitions, this.#buildFilterField);

    const request = new CountTasksByStatusRequest({
      filters: requestFilters
    });

    return this.grpcClient.countTasksByStatus(request);
  }

  #buildFilterField(filter: Filter<TaskSummaryEnumField, TaskOptionEnumField>) {
    return (type: FilterType, field: TaskSummaryField, isForRoot: boolean, isCustom: boolean) => {

      let filterField: TaskFilterField.AsObject['field'];
      if (isForRoot) {
        filterField = {
          taskSummaryField: {
            field: field as TaskSummaryEnumField
          }
        };
      } else if (isCustom) {
        filterField = {
          taskOptionGenericField: {
            field: field as string
          }
        };
      } else {
        filterField = {
          taskOptionField: {
            field: field as TaskOptionEnumField
          }
        };
      }

      switch (type) {
      case 'string':
        return {
          field: filterField,
          filterString: {
            value: filter.value?.toString() ?? '',
            operator: filter.operator ?? FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
          },
        } satisfies TaskFilterField.AsObject;
      case 'status':
        return {
          field: filterField,
          filterStatus: {
            value: Number(filter.value) ?? 0,
            operator: filter.operator ?? FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
          },
        } satisfies TaskFilterField.AsObject;
      case 'number':
        return {
          field: filterField,
          filterStatus: {
            value: Number(filter.value) ?? 0,
            operator: filter.operator ?? FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL
          },
        } satisfies TaskFilterField.AsObject;
      case 'date':
        return {
          field: filterField,
          filterDate: {
            value: {
              nanos: 0,
              seconds: filter.value?.toString() ?? '0'
            },
            operator: filter.operator ?? FilterDateOperator.FILTER_DATE_OPERATOR_EQUAL
          }
        } satisfies TaskFilterField.AsObject;
      default:
        throw new Error(`Type ${type} not supported`);
      }
    };
  }
}
