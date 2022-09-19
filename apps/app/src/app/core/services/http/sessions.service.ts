import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  GetSessionRequest,
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse
} from '../../types/proto/sessions-common.pb';
import { SessionsClient } from '../../types/proto/sessions-service.pbsc';

@Injectable()
export class SessionsService {
  constructor(
    private grpcSessionClient: SessionsClient,
  ) {}

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
    // TODO: rework params, return the observable and update the component
    console.log(params.get('applicationName'));
    const options = new ListSessionsRequest({
      page: Number(params.get('page') || '0'),
      pageSize: Number(params.get('limit') || '10'),
      filter: {
        // applicationName: params.get('applicationName') || '',
        // applicationVersion: params.get('applicationVersion') || '',
      },
      sort: {
        field: ListSessionsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction: ListSessionsRequest.OrderDirection.ORDER_DIRECTION_ASC,
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
   * @param id Id of the session
   */
  cancel(id: string) {
    // const session = new SessionRequest({
    //   id,
    // });
    // this.client.cancelSession(session).subscribe(console.log);
  }
}
