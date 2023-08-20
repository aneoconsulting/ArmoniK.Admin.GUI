import { SortDirection as ArmoniKSortDirection, FilterStringOperator, GetResultRequest, GetResultResponse, ListResultsRequest, ListResultsResponse, ResultFilterField, ResultRawEnumField, ResultsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { FilterType } from '@app/types/filters';
import { UtilsService } from '@services/utils.service';
import {  ResultRawFieldKey, ResultRawFilter, ResultRawFiltersOr, ResultRawListOptions } from '../types';

@Injectable()
export class ResultsGrpcService {
  readonly #resultsFiltersService = inject(DATA_FILTERS_SERVICE);
  readonly #utilsService = inject(UtilsService<ResultRawEnumField>);
  readonly #resultsClient = inject(ResultsClient);

  readonly sortDirections: Record<SortDirection, ArmoniKSortDirection> = {
    'asc': ArmoniKSortDirection.SORT_DIRECTION_ASC,
    'desc': ArmoniKSortDirection.SORT_DIRECTION_DESC,
    '': ArmoniKSortDirection.SORT_DIRECTION_UNSPECIFIED
  };

  readonly sortFields: Record<ResultRawFieldKey, ResultRawEnumField> = {
    'sessionId': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID,
    'name': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME,
    'status': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS,
    'createdAt': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT,
    'ownerTaskId': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID,
    'resultId': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
    'completedAt': ResultRawEnumField.RESULT_RAW_ENUM_FIELD_COMPLETED_AT,
  };


  list$(options: ResultRawListOptions, filters: ResultRawFiltersOr): Observable<ListResultsResponse> {

    const requestFilters = this.#utilsService.createFilters<ResultFilterField.AsObject>(filters, this.#resultsFiltersService.retriveFiltersDefinitions(), this.#buildFilterField);

    const listResultRequest = new ListResultsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: this.sortDirections[options.sort.direction],
        field: {
          resultRawField: {
            field: this.sortFields[options.sort.active] ?? ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID
          }
        }
      },
      filters: requestFilters
    });

    return this.#resultsClient.listResults(listResultRequest);
  }

  get$(resultId: string): Observable<GetResultResponse> {
    const getResultRequest = new GetResultRequest({
      resultId
    });

    return this.#resultsClient.getResult(getResultRequest);
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
        return {
          field: filterField,
          filterString: {
            value: filter.value?.toString() ?? '',
            operator: filter.operator ?? FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
          }
        } satisfies ResultFilterField.AsObject;
      default: {
        throw new Error(`Type ${type} not supported`);
      }
      }
    };
  }
}
