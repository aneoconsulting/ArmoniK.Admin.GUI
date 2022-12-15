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

  /**
   * Transform an urlParams into a real GrpcParams object designed for retrieving tasks data
   *
   * @param urlParams Record<string, string | number>
   * @returns GrpcParams<
   *            ListResultsRequest.OrderByField,
   *            ListResultsRequest.OrderDirection,
   *            ListResultsRequest.Filter.AsObject
   *          >
   */
  public urlToGrpcParams(
    urlParams: Record<string, string | number>
  ): GrpcParams<
    ListResultsRequest.OrderByField,
    ListResultsRequest.OrderDirection,
    ListResultsRequest.Filter.AsObject
  > {
    const grpcParams: GrpcParams<
      ListResultsRequest.OrderByField,
      ListResultsRequest.OrderDirection,
      ListResultsRequest.Filter.AsObject
    > = {};
    const filter: ListResultsRequest.Filter.AsObject = {
      sessionId: '',
      name: '',
      ownerTaskId: '',
      status: 0,
    };

    for (const [key, value] of Object.entries(urlParams)) {
      if (key == 'page') {
        grpcParams.page = value as number;
      } else if (key == 'PageSize') {
        grpcParams.pageSize = value as number;
      } else if (key === 'order') {
        grpcParams.order = value as number;
      } else if (key === 'orderBy') {
        grpcParams.orderBy = value as number;
      } else {
        if (key === 'name') {
          filter.name = value as string;
        } else if (key === 'sessionId') {
          filter.sessionId = value as string;
        } else if (key === 'taskId') {
          filter.ownerTaskId = value as string;
        } else if (key === 'status') {
          filter.status = value as number;
        } else if (key === 'createdBefore') {
          filter.createdBefore = this._createTimeFilter(value as number);
        } else if (key === 'createdAfter') {
          // The date filter is giving a date on day to soon for the "afters" values. So we had a day.
          filter.createdAfter = this._createTimeFilter(
            (value as number) + 86400000
          );
        }
      }
    }
    grpcParams.filter = filter;
    return grpcParams;
  }

  public list$(
    params: GrpcParams<
      ListResultsRequest.OrderByField,
      ListResultsRequest.OrderDirection,
      ListResultsRequest.Filter.AsObject
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
      filter: params.filter,
    });

    return this._resultsClient
      .listResults(options)
      .pipe(takeUntil(this._timeout$));
  }
}
