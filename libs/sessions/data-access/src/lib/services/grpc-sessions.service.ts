import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  CancelSessionRequest,
  CancelSessionResponse,
  GetSessionRequest,
  GetSessionResponse,
  GrpcParams,
  ListSessionsRequest,
  ListSessionsResponse,
  SessionsClient,
  TimeFilter,
} from '@armonik.admin.gui/shared/data-access';
import { SessionFilter } from '../types/session-filter.type';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcSessionsService extends BaseGrpcService {
  constructor(private _sessionsClient: SessionsClient) {
    super();
  }

  /**
   * Transform an urlParams into a real GrpcParams object designed for retrieving session data
   *
   * @param urlParams Record<string, string | number>
   * @returns GrpcParams<
   *            ListSessionsRequest.OrderByField,
   *            ListSessionsRequest.OrderDirection,
   *             SessionFilter
   *          >
   */
  public urlToGrpcParams(
    urlParams: Record<string, string | number>
  ): GrpcParams<
    ListSessionsRequest.OrderByField,
    ListSessionsRequest.OrderDirection,
    SessionFilter
  > {
    const grpcParams: GrpcParams<
      ListSessionsRequest.OrderByField,
      ListSessionsRequest.OrderDirection,
      SessionFilter
    > = {};
    const filter: SessionFilter = {};

    for (const [key, value] of Object.entries(urlParams)) {
      if (key === 'page') {
        grpcParams.page = value as number;
      } else if (key === 'pageSize') {
        grpcParams.pageSize = value as number;
      } else if (key === 'order') {
        grpcParams.order = value as number;
      } else if (key === 'orderBy') {
        grpcParams.orderBy = value as number;
      } else {
        if (key === 'sessionId') {
          filter.sessionId = value as string;
        } else if (key === 'status') {
          filter.status = value as number;
        } else if (key === 'createdAtBefore') {
          filter.createdBefore = this.createTimeFilter(value as number);
        } else if (key === 'createdAtAfter') {
          // The date filter is giving a date on day to soon for the "afters" values. So we had a day.
          filter.createdAfter = this.createTimeFilter(
            (value as number) + 86400000
          );
        } else if (key === 'cancelledAtBefore') {
          filter.cancelledBefore = this.createTimeFilter(value as number);
        } else if (key === 'cancelledAtAfter') {
          filter.cancelledAfter = this.createTimeFilter(
            (value as number) + 86400000
          );
        }
      }
    }
    grpcParams.filter = filter;
    return grpcParams;
  }

  /**
   * Get a list of sessions
   *
   * @param params
   *
   * @returns Observable<ListSessionsResponse>
   */
  public list$(
    params: GrpcParams<
      ListSessionsRequest.OrderByField,
      ListSessionsRequest.OrderDirection,
      SessionFilter
    >
  ): Observable<ListSessionsResponse> {
    const options = new ListSessionsRequest({
      page: params.page || 0,
      pageSize: params.pageSize || 10,
      sort: {
        field:
          params.orderBy ||
          ListSessionsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction:
          params.order ||
          ListSessionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
      filter: params.filter,
    });
    return this._sessionsClient
      .listSessions(options)
      .pipe(takeUntil(this._timeout$));
  }

  /**
   * Get a session
   *
   * @param sessionId
   *
   * @returns Observable<GetSessionResponse>
   */
  public get$(sessionId: string): Observable<GetSessionResponse> {
    const options = new GetSessionRequest({
      sessionId,
    });

    return this._sessionsClient
      .getSession(options)
      .pipe(takeUntil(this._timeout$));
  }

  /**
   * Cancel a session
   *
   * @param sessionId
   *
   * @returns Observable<CancelSessionResponse>
   */
  public cancel$(sessionId: string): Observable<CancelSessionResponse> {
    const options = new CancelSessionRequest({
      sessionId,
    });

    return this._sessionsClient.cancelSession(options);
  }

  private createTimeFilter(value: number): TimeFilter {
    return {
      nanos: 0,
      seconds: (value / 1000).toString(),
    };
  }
}
