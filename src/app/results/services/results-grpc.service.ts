import { GetResultRequest, GetResultResponse, ListResultsRequest, ListResultsResponse, ResultFilterField, ResultRawEnumField, ResultsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterType } from '@app/types/filters';
import { GrpcGetInterface, GrpcListInterface } from '@app/types/services/grpcService';
import { buildDateFilter, buildNumberFilter, buildStatusFilter, buildStringFilter, sortDirections } from '@services/grpc-build-request.service';
import { UtilsService } from '@services/utils.service';
import { ResultsFiltersService } from './results-filters.service';
import {  ResultRawFieldKey, ResultRawFilter, ResultRawFilters, ResultRawListOptions } from '../types';

@Injectable()
export class ResultsGrpcService implements GrpcListInterface<ResultsClient, ResultRawListOptions, ResultRawFilters, ResultRawFieldKey, ResultRawEnumField>, GrpcGetInterface<GetResultResponse> {
  readonly filterService = inject(ResultsFiltersService);
  readonly utilsService = inject(UtilsService<ResultRawEnumField>);
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

    const requestFilters = this.utilsService.createFilters<ResultFilterField.AsObject>(filters, this.filterService.filtersDefinitions, this.#buildFilterField);

    const listResultRequest = new ListResultsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: sortDirections[options.sort.direction],
        field: {
          resultRawField: {
            field: this.sortFields[options.sort.active] ?? ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID
          }
        }
      },
      filters: requestFilters
    });

    return this.grpcClient.listResults(listResultRequest);
  }

  get$(resultId: string): Observable<GetResultResponse> {
    const getResultRequest = new GetResultRequest({
      resultId
    });

    return this.grpcClient.getResult(getResultRequest);
  }

  #buildFilterField(filter: ResultRawFilter) {
    return (type: FilterType, field: ResultRawEnumField) => {

      const filterField = {
        resultRawField: {
          field: field as ResultRawEnumField
        }
      } satisfies ResultFilterField.AsObject['field'];

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
    };
  }
}
