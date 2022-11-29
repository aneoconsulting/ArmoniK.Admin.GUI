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

  /**
   * Create a filter that can be passed to the ListSessionsResponse object.
   *
   * @param params
   * @returns SessionFilter
   */
  createFilterObject(
    params: GrpcParams<
      ListSessionsRequest.OrderByField,
      ListSessionsRequest.OrderDirection
    >
  ): SessionFilter {
    const filter: SessionFilter = {};
    const paramsFilter = params as SessionPageFilter; // Transform the params in order to have all required properties

    if (paramsFilter.sessionId) {
      filter.sessionId = paramsFilter.sessionId;
    }
    if (paramsFilter.status) {
      filter.status = paramsFilter.status;
    }
    if (paramsFilter.createdAtBefore) {
      filter.createdBefore = {
        nano: 0,
        seconds: paramsFilter.createdAtBefore.toString(),
      };
    }
    if (paramsFilter.createdAtAfter) {
      filter.createdAfter = {
        nano: 0,
        seconds: paramsFilter.createdAtAfter.toString(),
      };
    }
    if (paramsFilter.cancelledAtBefore) {
      filter.cancelledBefore = {
        nano: 0,
        seconds: paramsFilter.cancelledAtBefore.toString(),
      };
    }
    if (paramsFilter.cancelledAtAfter) {
      filter.cancelledAfter = {
        nano: 0,
        seconds: paramsFilter.cancelledAtAfter.toString(),
      };
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
