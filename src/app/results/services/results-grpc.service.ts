import { GetResultRequest, GetResultResponse, ListResultsRequest, ListResultsResponse, ResultFilterField, ResultRawEnumField, ResultsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter, FilterType } from '@app/types/filters';
import { GrpcGetInterface, GrpcTableService, ListDefaultSortField } from '@app/types/services/grpcService';
import { FilterField, buildDateFilter, buildNumberFilter, buildStatusFilter, buildStringFilter } from '@services/grpc-build-request.service';
import { ResultsFiltersService } from './results-filters.service';
import { ResultRawFieldKey, ResultRawFilters, ResultRawListOptions } from '../types';

@Injectable()
export class ResultsGrpcService extends GrpcTableService<ResultRawFieldKey, ResultRawListOptions, ResultRawEnumField>
  implements GrpcGetInterface<GetResultResponse> {

  readonly defaultSortField = ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID;

  readonly filterService = inject(ResultsFiltersService);
  readonly grpcClient = inject(ResultsClient);

  readonly sortFields: Record<ResultRawFieldKey, ResultRawEnumField> = {
    'sessionId': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID,
    'name': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME,
    'status': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS,
    'createdAt': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT,
    'ownerTaskId': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID,
    'resultId': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
    'completedAt': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_COMPLETED_AT,
    'size': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SIZE,
  };

  list$(options: ResultRawListOptions, filters: ResultRawFilters): Observable<ListResultsResponse> {
    const listResultRequest = new ListResultsRequest(this.createListRequest(options, filters) as ListResultsRequest);
    return this.grpcClient.listResults(listResultRequest);
  }

  get$(resultId: string): Observable<GetResultResponse> {
    const getResultRequest = new GetResultRequest({
      resultId
    });

    return this.grpcClient.getResult(getResultRequest);
  }

  createSortField(field: ResultRawEnumField): ListDefaultSortField {
    return {
      field: {
        resultRawField: {
          field: field
        }
      }
    };
  }

  createFilterField(field: ResultRawEnumField): FilterField {
    return {
      resultRawField: {
        field: field as ResultRawEnumField
      }
    } satisfies ResultFilterField.AsObject['field'];
  }

  buildFilter(type: FilterType, filterField: FilterField, filter: Filter<ResultRawEnumField>) {
    switch (type) {
    case 'string':
      return buildStringFilter(filterField, filter) as ResultFilterField.AsObject;
    case 'date':
      return buildDateFilter(filterField, filter) as ResultFilterField.AsObject;
    case 'status':
      return buildStatusFilter(filterField, filter) as ResultFilterField.AsObject;
    case 'number':
      return buildNumberFilter(filterField, filter) as ResultFilterField.AsObject;
    default: {
      throw new Error(`Type ${type} not supported`);
    }
    }
  }
}
