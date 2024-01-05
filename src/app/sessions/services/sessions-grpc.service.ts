import { SortDirection as ArmoniKSortDirection, CancelSessionRequest, CancelSessionResponse, FilterArrayOperator, FilterDateOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, GetSessionRequest, GetSessionResponse, ListSessionsRequest, ListSessionsResponse, SessionFilterField, SessionRawEnumField, SessionTaskOptionEnumField, SessionsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { Filter, FilterType } from '@app/types/filters';
import { UtilsService } from '@services/utils.service';
import { SessionsFiltersService } from './sessions-filters.service';
import { SessionRawField, SessionRawFieldKey, SessionRawFiltersOr, SessionRawListOptions } from '../types';

@Injectable()
export class SessionsGrpcService{
  readonly #sessionsFiltersService = inject(SessionsFiltersService);
  readonly #sessionsClient = inject(SessionsClient);
  readonly #utilsService = inject(UtilsService<SessionRawEnumField, SessionTaskOptionEnumField>);

  readonly sortDirections: Record<SortDirection, ArmoniKSortDirection> = {
    'asc': ArmoniKSortDirection.SORT_DIRECTION_ASC,
    'desc': ArmoniKSortDirection.SORT_DIRECTION_DESC,
    '': ArmoniKSortDirection.SORT_DIRECTION_UNSPECIFIED
  };

  readonly sortFields: Record<SessionRawFieldKey, SessionRawEnumField> = {
    'sessionId': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
    'status': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
    'createdAt': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
    'cancelledAt': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CANCELLED_AT,
    'options': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_OPTIONS,
    'partitionIds': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS,
    'duration': SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DURATION,
  };

  list$(options: SessionRawListOptions, filters: SessionRawFiltersOr): Observable<ListSessionsResponse> {

    const requestFilters = this.#utilsService.createFilters<SessionFilterField.AsObject>(filters, this.#sessionsFiltersService.retrieveFiltersDefinitions(), this.#buildFilterField);

    const listSessionsRequest = new ListSessionsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: this.sortDirections[options.sort.direction],
        field: {
          sessionRawField: {
            field: this.sortFields[options.sort.active] ?? SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID
          }
        }
      },
      filters: requestFilters
    });

    return this.#sessionsClient.listSessions(listSessionsRequest);
  }

  get$(sessionId: string): Observable<GetSessionResponse> {
    const getSessionRequest = new GetSessionRequest({
      sessionId
    });

    return this.#sessionsClient.getSession(getSessionRequest);
  }

  cancel$(sessionId: string): Observable<CancelSessionResponse> {
    const cancelSessionRequest = new CancelSessionRequest({
      sessionId
    });

    return this.#sessionsClient.cancelSession(cancelSessionRequest);
  }

  #buildFilterField(filter: Filter<SessionRawEnumField, SessionTaskOptionEnumField>) {
    return (type: FilterType, field: SessionRawField | SessionTaskOptionEnumField, isForRoot: boolean, isGeneric: boolean) => {
      let filterField: SessionFilterField.AsObject['field'];

      if (isForRoot) {
        filterField = {
          sessionRawField: {
            field: field as SessionRawEnumField
          }
        };
      } else if (isGeneric) {
        filterField = {
          taskOptionGenericField: {
            field: field as unknown as string
          }
        };
      } else {
        filterField = {
          taskOptionField: {
            field: field as SessionTaskOptionEnumField
          }
        };
      }

      switch (type) {
      case 'string':
        return {
          field: filterField,
          filterString: {
            value: filter.value?.toString() ?? '',
            operator: filter.operator ?? FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          },
        } satisfies SessionFilterField.AsObject;
      case 'status':
        return {
          field: filterField,
          filterStatus: {
            value: Number(filter.value) ?? 0,
            operator: filter.operator ?? FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
          }
        } satisfies SessionFilterField.AsObject;
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
        } satisfies SessionFilterField.AsObject;
      case 'number':
        return {
          field: filterField,
          filterNumber: {
            value: filter.value?.toString() ?? '',
            operator: filter.operator ?? FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
          }
        } satisfies SessionFilterField.AsObject;
      case 'array':
        return {
          field: filterField,
          filterArray: {
            value: filter.value?.toString() ?? '',
            operator: filter.operator ?? FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS
          }
        } satisfies SessionFilterField.AsObject;
      default:
        throw new Error(`Type ${type} not supported`);
      }
    };
  }
}
