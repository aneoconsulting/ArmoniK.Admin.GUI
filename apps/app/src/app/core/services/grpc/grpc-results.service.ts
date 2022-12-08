import { Injectable } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { GrpcParams } from '../../types/grpc-params.type';
import {
  ListResultsRequest,
  ListResultsResponse,
} from '../../types/proto/results-common.pb';
import { ResultsClient } from '../../types/proto/results-service.pbsc';
// import { ResultFilter } from '../../types/result-filter.type';
import { BaseGrpcService } from './base-grpc.service';

@Injectable()
export class GrpcResultsService extends BaseGrpcService {
  constructor(private _resultsClient: ResultsClient) {
    super();
  }

  // public urlToGrpcParams(
  //   urlParams: Record<string, string | number>
  // ): GrpcParams<
  //   ListSessionsRequest.OrderByField,
  //   ListSessionsRequest.OrderDirection,
  //   ResultFilter
  // > {
  //   const grpcParams: GrpcParams<
  //     ListSessionsRequest.OrderByField,
  //     ListSessionsRequest.OrderDirection,
  //     SessionFilter
  //   > = {};
  //   const filter: ResultFilter = {};

  //   for(const [key, value] of Object.entries(urlParams)) {
  //     if (key == 'page') {
  //       grpcParams.page = value as number;
  //     } else if (key == 'PageSize') {
  //       grpcParams.pageSize = value as number;
  //     } else if (key === 'order') {
  //       grpcParams.order = value as number;
  //     } else if (key === 'orderBy') {
  //       grpcParams.orderBy = value as number;
  //     } else {
  //       if (key === 'name') {
  //         filter.name = value as string;
  //       } else if (key === 'sessionId') {
  //         filter.sessionId = value as string;
  //       } else if (key === 'taskId') {
  //         filter.taskId = value as string;
  //       } else if (key === 'status') {
  //         filter.status = value as number;
  //       } else if (key === 'createdBefore') {
  //         filter.createdBefore = this.createTimeFilter(value as number);
  //       } else if (key === 'createdAfter') {
  //         // The date filter is giving a date on day to soon for the "afters" values. So we had a day.
  //         filter.createdAfter = this.createTimeFilter(
  //           (value as number) + 86400000
  //         );
  //       }
  //     }
  //   }
  //   grpcParams.filter = filter;
  //   return grpcParams;
  // }

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
    });

    return this._resultsClient
      .listResults(options)
      .pipe(takeUntil(this._timeout$));
  }

  // createTimeFilter(value: number): TimeFilter {
  //   return {
  //     nanos: 0,
  //     seconds: (value/1000).toString()
  //   };
  // }
}
