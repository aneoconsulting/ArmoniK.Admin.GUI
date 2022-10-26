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
    console.log(params);
    const options = new ListResultsRequest({
      page: Number(params.get('page')) || 0,
      pageSize: Number(params.get('pageSize')) || 10,
      sort: {
        field:
          Number(params.get('orderBy')) ||
          ListResultsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction:
          Number(params.get('order')) === 1
            ? ListResultsRequest.OrderDirection.ORDER_DIRECTION_ASC
            : ListResultsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
      filter: {},
    });

    return this._resultsClient.listResults(options);
  }
}
