import { Injectable } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { GrpcParams } from '../../types/grpc-params.type';
import {
  CancelSessionRequest,
  CancelSessionResponse,
  GetSessionRequest,
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
} from '../../types/proto/sessions-common.pb';
import { SessionsClient } from '../../types/proto/sessions-service.pbsc';
import { SessionFilter } from '../../types/session-filter.type';
import { BaseGrpcService } from './base-grpc.service';

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
          filter.createdBefore = {
            nano: 0,
            seconds: ((value as number) / 1000).toString(),
          };
        } else if (key === 'createdAtAfter') {
          filter.createdAfter = {
            nano: 0,
            seconds: ((value as number) / 1000).toString(),
          };
        } else if (key === 'cancelledAtBefore') {
          filter.cancelledBefore = {
            nano: 0,
            seconds: ((value as number) / 1000).toString(),
          };
        } else if (key === 'cancelledAtAfter') {
          filter.cancelledAfter = {
            nano: 0,
            seconds: ((value as number) / 1000).toString(),
          };
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
}
