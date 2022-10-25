import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ListResultsRequest,
  ListResultsResponse,
} from '../../types/proto/results-common.pb';
import { ResultsClient } from '../../types/proto/results-service.pbsc';

@Injectable()
export class GrpcResultsService {
  constructor(private _resultsClient: ResultsClient) {}

  public list$(params: HttpParams): Observable<ListResultsResponse> {
    const options = new ListResultsRequest({
      page: 0,
      pageSize: 10,
      sort: {
        field: ListResultsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction: ListResultsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
      filter: {},
    });

    return this._resultsClient.listResults(options);
  }
}
