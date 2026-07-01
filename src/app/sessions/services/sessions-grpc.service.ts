import { CancelSessionRequest, CancelSessionResponse, CloseSessionRequest, CloseSessionResponse, DeleteSessionRequest, DeleteSessionResponse, FilterStringOperator, GetSessionRequest, GetSessionResponse, ListSessionsRequest, ListSessionsResponse, PauseSessionRequest, PauseSessionResponse, PurgeSessionRequest, PurgeSessionResponse, ResumeSessionRequest, ResumeSessionResponse, SessionField, SessionFilterField, SessionRawEnumField, SessionTaskOptionEnumField, SessionsClient, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TaskOptions } from '@app/tasks/types';
import { Filter, FilterType } from '@app/types/filters';
import { GrpcCancelInterface, GrpcGetInterface, GrpcTableService, ListDefaultSortField } from '@app/types/services/grpcService';
import { FilterField, buildArrayFilter, buildBooleanFilter, buildDateFilter, buildNumberFilter, buildStatusFilter, buildStringFilter } from '@services/grpc-build-request.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { Observable, map } from 'rxjs';
import { SessionsFiltersService } from './sessions-filters.service';
import { SessionRaw, SessionRawFieldKey, SessionRawFilters, SessionRawListOptions } from '../types';

@Injectable()
export class SessionsGrpcService extends GrpcTableService<SessionRaw, SessionRawEnumField, TaskOptions, TaskOptionEnumField>
  implements GrpcGetInterface<GetSessionResponse>, GrpcCancelInterface<CancelSessionResponse> {
  readonly filterService = inject(SessionsFiltersService);
  readonly grpcClient = inject(SessionsClient);
  readonly tasksGrpcService = inject(TasksGrpcService);
  readonly sortFieldService = new GrpcSortFieldService();

  readonly sortFields: Record<SessionRawFieldKey, SessionRawEnumField> = {
    'sessionId': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
    'status': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
    'createdAt': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
    'cancelledAt': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CANCELLED_AT,
    'options': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_OPTIONS,
    'partitionIds': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS,
    'duration': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DURATION,
    'closedAt': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
    'deletedAt': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DELETED_AT,
    'purgedAt': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PURGED_AT,
    'clientSubmission': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLIENT_SUBMISSION,
    'workerSubmission': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_WORKER_SUBMISSION,
  };

  list$(options: SessionRawListOptions, filters: SessionRawFilters): Observable<ListSessionsResponse> {
    const listSessionsRequest = new ListSessionsRequest(this.createListRequest(options, filters) as ListSessionsRequest);
    return this.grpcClient.listSessions(listSessionsRequest);
  }

  createSortField(field: SessionRawFieldKey): ListDefaultSortField {
    return {
      field: this.sortFieldService.buildSortField(field,
        () => {
          return {
            sessionRawField: {
              field: this.sortFields[field] ?? SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT
            }
          } as SessionField;
        }
      )
    };
  }

  createFilterField(field: SessionRawEnumField | SessionTaskOptionEnumField | string, isForRoot?: boolean, isCustom?: boolean): FilterField {
    if (isForRoot) {
      return {
        sessionRawField: {
          field: field as SessionRawEnumField
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
          field: field as SessionTaskOptionEnumField
        }
      };
    }
  }

  buildFilter(type: FilterType, filterField: FilterField, filter: Filter<SessionRawEnumField, SessionTaskOptionEnumField>): SessionFilterField.AsObject {
    switch (type) {
    case 'string':
      return buildStringFilter(filterField, filter) as SessionFilterField.AsObject;
    case 'status':
      return buildStatusFilter(filterField, filter) as SessionFilterField.AsObject;
    case 'date':
      return buildDateFilter(filterField, filter) as SessionFilterField.AsObject;
    case 'number':
      return buildNumberFilter(filterField, filter) as SessionFilterField.AsObject;
    case 'array':
      return buildArrayFilter(filterField, filter) as SessionFilterField.AsObject;
    case 'boolean':
      return buildBooleanFilter(filterField, filter) as SessionFilterField.AsObject;
    default:
      throw new Error(`Type ${type} not supported`);
    }
  }

  get$(sessionId: string): Observable<GetSessionResponse> {
    const getSessionRequest = new GetSessionRequest({
      sessionId
    });

    return this.grpcClient.getSession(getSessionRequest);
  }

  cancel$(sessionId: string): Observable<CancelSessionResponse> {
    const cancelSessionRequest = new CancelSessionRequest({
      sessionId
    });

    return this.grpcClient.cancelSession(cancelSessionRequest);
  }

  pause$(sessionId: string): Observable<PauseSessionResponse> {
    const pauseSessionRequest = new PauseSessionRequest({
      sessionId
    });

    return this.grpcClient.pauseSession(pauseSessionRequest);
  }

  resume$(sessionId: string): Observable<ResumeSessionResponse> {
    const resumeSessionRequest = new ResumeSessionRequest({
      sessionId
    });

    return this.grpcClient.resumeSession(resumeSessionRequest);
  }

  purge$(sessionId: string): Observable<PurgeSessionResponse> {
    const purgeSessionRequest = new PurgeSessionRequest({
      sessionId
    });

    return this.grpcClient.purgeSession(purgeSessionRequest);
  }

  close$(sessionId: string): Observable<CloseSessionResponse> {
    const closeSessionRequest = new CloseSessionRequest({
      sessionId
    });

    return this.grpcClient.closeSession(closeSessionRequest);
  }

  delete$(sessionId: string): Observable<DeleteSessionResponse> {
    const deleteSessionRequest = new DeleteSessionRequest({
      sessionId
    });

    return this.grpcClient.deleteSession(deleteSessionRequest);
  }

  getTaskData$(sessionId: string, active: 'createdAt' | 'endedAt', direction: SortDirection) {
    return this.tasksGrpcService.list$(
      {
        pageIndex: 0,
        pageSize: 1,
        sort: { active, direction }
      },
      [[{
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: sessionId
      }]]
    ).pipe(map(taskData => {
      return {
        date: active === 'endedAt' ? taskData.tasks?.at(0)?.endedAt : taskData.tasks?.at(0)?.createdAt,
        sessionId: sessionId
      };
    }));
  }
}
