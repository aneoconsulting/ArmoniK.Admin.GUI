import { Injectable } from '@angular/core';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { mergeMap, Observable, takeUntil, throwError, timer } from 'rxjs';
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

@Injectable()
export class GrpcSessionsService {
  private _timeout$ = timer(8_000).pipe(
    mergeMap(() => throwError(() => new Error('gRPC Timeout')))
  );

  constructor(private _sessionsClient: SessionsClient) {}

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
      ListSessionsRequest.OrderDirection
    >
  ): Observable<ListSessionsResponse> {
    const filterValue = this.createFilterObject(params);
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
      filter: {
        sessionId: filterValue.sessionId,
        status: filterValue.status,
        createdBefore: filterValue.createdBefore,
        createdAfter: filterValue.createdAfter,
        cancelledBefore: filterValue.closedBefore,
        cancelledAfter: filterValue.closedAfter,
      },
    });
    return this._sessionsClient
      .listSessions(options)
      .pipe(takeUntil(this._timeout$));
  }

  createFilterObject(
    params: GrpcParams<
      ListSessionsRequest.OrderByField,
      ListSessionsRequest.OrderDirection
    >
  ): SessionFilter {
    const filter: SessionFilter = {};
    filter.sessionId = params.sessionId;
    filter.status = params.status || 0;

    const timestamp = new Timestamp();

    if (params.createdAtBefore) {
      timestamp.seconds = (params.createdAtBefore / 1000).toString();
      filter.createdBefore = timestamp;
    }
    if (params.createdAtAfter) {
      timestamp.seconds = (params.createdAtAfter / 1000).toString();
      filter.createdAfter = timestamp;
    }
    if (params.closedAtBefore) {
      timestamp.seconds = (params.closedAtBefore / 1000).toString();
      filter.closedBefore = timestamp;
    }
    if (params.closedAtAfter) {
      timestamp.seconds = (params.closedAtAfter / 1000).toString();
      filter.closedAfter = timestamp;
    }

    return filter;
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
