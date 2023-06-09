import { SortDirection as ArmoniKSortDirection, GetResultRequest, GetResultResponse, ListResultsRequest, ListResultsResponse, ResultRawField, ResultStatus, ResultsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { AppGrpcService } from '@app/types/services';
import { UtilsService } from '@services/utils.service';
import {  ResultRaw, ResultRawFieldKey, ResultRawFilter, ResultRawListOptions } from '../types';

@Injectable()
export class ResultsGrpcService implements AppGrpcService<ResultRaw> {
  readonly sortDirections: Record<SortDirection, ArmoniKSortDirection> = {
    'asc': ArmoniKSortDirection.SORT_DIRECTION_ASC,
    'desc': ArmoniKSortDirection.SORT_DIRECTION_DESC,
    '': ArmoniKSortDirection.SORT_DIRECTION_UNSPECIFIED
  };

  readonly sortFields: Record<ResultRawFieldKey, ResultRawField> = {
    'sessionId': ResultRawField.RESULT_RAW_FIELD_SESSION_ID,
    'name': ResultRawField.RESULT_RAW_FIELD_NAME,
    'status': ResultRawField.RESULT_RAW_FIELD_STATUS,
    'createdAt': ResultRawField.RESULT_RAW_FIELD_CREATED_AT,
    'ownerTaskId': ResultRawField.RESULT_RAW_FIELD_OWNER_TASK_ID,
    'resultId': ResultRawField.RESULT_RAW_FIELD_RESULT_ID,
    'completedAt': ResultRawField.RESULT_RAW_FIELD_COMPLETED_AT,
  };


  constructor(
    private _resultsClient: ResultsClient,
    private _utilsService: UtilsService<ResultRaw>
  ) { }

  list$(options: ResultRawListOptions, filters: ResultRawFilter[]): Observable<ListResultsResponse> {
    const findFilter = this._utilsService.findFilter;
    const convertFilterValue = this._utilsService.convertFilterValue;

    const listResultRequest = new ListResultsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: this.sortDirections[options.sort.direction],
        field: {
          resultRawField: this.sortFields[options.sort.active] ?? ResultRawField.RESULT_RAW_FIELD_SESSION_ID
        }
      },
      filter: {
        name: convertFilterValue(findFilter(filters, 'name')),
        // TODO: Find a way to convert the status (as sort direction, we can create a corresponding enum)
        status: ResultStatus.RESULT_STATUS_UNSPECIFIED,
        ownerTaskId: convertFilterValue(findFilter(filters, 'ownerTaskId')),
        sessionId: convertFilterValue(findFilter(filters, 'sessionId')),
        resultId: convertFilterValue(findFilter(filters, 'resultId')),
        // TODO: Find a way to get the created after and the created before (for now, they are optional)
      }
    });

    return this._resultsClient.listResults(listResultRequest);
  }

  get$(resultId: string): Observable<GetResultResponse> {
    const getResultRequest = new GetResultRequest({
      resultId
    });

    return this._resultsClient.getResult(getResultRequest);
  }
}
