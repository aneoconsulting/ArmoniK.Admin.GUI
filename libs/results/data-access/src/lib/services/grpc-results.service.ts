import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  GrpcParams,
  ListResultsRequest,
  ListResultsResponse,
  ResultsClient,
} from '@armonik.admin.gui/shared/data-access';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcResultsService extends BaseGrpcService {
  constructor(private _resultsClient: ResultsClient) {
    super();
  }

  public list$(
    params: GrpcParams<
      ListResultsRequest.OrderByField,
      ListResultsRequest.OrderDirection,
      ResultFilter
    >
  ): Observable<ListResultsResponse> {
    const options = new ListResultsRequest({
      page: params.page || 0,
      pageSize: params.pageSize || 10,
      sort: {
        field:
          params.orderBy ||
          ListResultsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction:
          params.order ||
          ListResultsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
    });

    return this._resultsClient
      .listResults(options)
      .pipe(takeUntil(this._timeout$));
  }
}
