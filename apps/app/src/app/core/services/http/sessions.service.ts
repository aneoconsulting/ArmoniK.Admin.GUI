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
export class SessionsService {
  constructor(private grpcSessionClient: SessionsClient) {}

  /**
   * Used to get the list of sessions from the api using pagination and filters
   *
   * @param applicationId Id of the application
   * @param page Page number
   * @param limit Number of items per page
   *
   * @returns Pagination of sessions
   */
  getAllPaginated(
    params: HttpParams = new HttpParams()
  ): Observable<ListSessionsResponse> {
    console.log('params', params);
    console.log(params.get('applicationName'));
    const options = new ListSessionsRequest({
      page: Number(params.get('page')),
      pageSize: Number(params.get('limit')),
      // Use OrderByField enum because of Clarity and how it works
      // In fact, the filter field name is the same as the sort field name
      filter: {
        sessionId:
          params.get(
            ListSessionsRequest.OrderByField.ORDER_BY_FIELD_SESSION_ID.toString()
          ) ?? undefined,
      },
      sort: {
        field: params.has('orderBy')
          ? (Number(
              params.get('orderBy')
            ) as unknown as ListSessionsRequest.OrderByField)
          : ListSessionsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction:
          Number(params.get('order')) === 1
            ? ListSessionsRequest.OrderDirection.ORDER_DIRECTION_ASC
            : ListSessionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
      },
    });
    return this.grpcSessionClient.listSessions(options);
  }

  /**
   * Used to get one session by id
   *
   * @param sessionId Id of the session
   *
   * @returns Session
   */
  getOne(sessionId: string): Observable<GetSessionResponse> {
    const options = new GetSessionRequest({
      sessionId,
    });

    return this.grpcSessionClient.getSession(options);
  }

  /**
   * Cancel a session
   *
   * @param sessionId Id of the session
   */
  cancel(sessionId: string): Observable<CancelSessionResponse> {
    const options = new CancelSessionRequest({
      sessionId,
    });

    return this.grpcSessionClient.cancelSession(options);
  }
}
