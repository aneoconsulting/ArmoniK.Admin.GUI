import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CancelSessionRequest,
  CancelSessionResponse,
  GetSessionRequest,
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
} from '../../types/proto/sessions-common.pb';
import { SessionsClient } from '../../types/proto/sessions-service.pbsc';

@Injectable()
export class GrpcSessionsService {
  constructor(private _sessionsClient: SessionsClient) {}

  /**
   * Get a list of sessions
   *
   * @param params
   *
   * @returns Observable<ListSessionsResponse>
   */
  public list$(params: HttpParams): Observable<ListSessionsResponse> {
    const options = new ListSessionsRequest({
      page: Number(params.get('page')) || 0,
      pageSize: Number(params.get('pageSize')) || 10,
      sort: {
        field:
          Number(params.get('orderBy')) ||
          ListSessionsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction:
          Number(params.get('order')) === 1
            ? ListSessionsRequest.OrderDirection.ORDER_DIRECTION_ASC
            : ListSessionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
      filter: {},
    });

    return this._sessionsClient.listSessions(options);
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

    return this._sessionsClient.getSession(options);
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
