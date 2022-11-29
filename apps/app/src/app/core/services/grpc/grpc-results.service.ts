import { Injectable } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { GrpcParams } from '../../types/grpc-params.type';
import {
  ListResultsRequest,
  ListResultsResponse,
} from '../../types/proto/results-common.pb';
import { ResultsClient } from '../../types/proto/results-service.pbsc';
import { BaseGrpcService } from './base-grpc.service';

@Injectable()
export class GrpcResultsService extends BaseGrpcService {
  constructor(private _resultsClient: ResultsClient) {
    super();
  }

  public list$(
    params: GrpcParams<
      ListResultsRequest.OrderByField,
      ListResultsRequest.OrderDirection
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
      filter: {},
    });

    return this._resultsClient
      .listResults(options)
      .pipe(takeUntil(this._timeout$));
  }
}
