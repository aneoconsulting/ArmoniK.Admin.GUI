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
import { SessionPageFilter } from '../../types/session-string-filter.type';
import { BaseGrpcService } from './base-grpc.service';

@Injectable()
export class GrpcSessionsService extends BaseGrpcService {
  constructor(private _sessionsClient: SessionsClient) {
    super();
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
        ...filterValue,
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
    const paramsFilter = params as SessionPageFilter;

    filter.sessionId = paramsFilter.sessionId;
    filter.status = paramsFilter.status || 0;

    const timestamp = new Timestamp();

    if (paramsFilter.createdAtBefore) {
      timestamp.seconds = (paramsFilter.createdAtBefore / 1000).toString();
      filter.createdBefore = new Timestamp(timestamp);
    }
    if (paramsFilter.createdAtAfter) {
      timestamp.seconds = (paramsFilter.createdAtAfter / 1000).toString();
      filter.createdAfter = new Timestamp(timestamp);
    }
    if (paramsFilter.cancelledAtBefore) {
      timestamp.seconds = (paramsFilter.cancelledAtBefore / 1000).toString();
      filter.cancelledBefore = new Timestamp(timestamp);
    }
    if (paramsFilter.cancelledAtAfter) {
      timestamp.seconds = (paramsFilter.cancelledAtAfter / 1000).toString();
      filter.cancelledAfter = new Timestamp(timestamp);
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
