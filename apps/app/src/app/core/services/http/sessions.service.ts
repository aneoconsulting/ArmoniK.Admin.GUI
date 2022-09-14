import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FormattedSession,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { Observable } from 'rxjs';
import { Session } from '../../models';
// import { Session as SessionRequest } from '../../types/proto/submitter-service.pb';
import { SubmitterClient } from '../../types/proto/submitter-service.pbsc';
import { ListSessionsRequest } from '../../types/proto/sessions-common.pb';
import { SessionsClient } from '../../types/proto/sessions-service.pbsc';
import { ApiService } from './api.service';

@Injectable()
export class SessionsService {
  private url = '/api/sessions';

  constructor(
    private apiService: ApiService,
    private grpcSessionClient: SessionsClient,
    private client: SubmitterClient
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
  ): Observable<Pagination<FormattedSession>> {
    // TODO: rework params, return the observable and update the component
    const options = new ListSessionsRequest({
      page: Number(params.get('page') || '1'),
      pageSize: Number(params.get('limit') || '10'),
      filter: {},
      sort: {
        field: ListSessionsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
        direction: ListSessionsRequest.OrderDirection.ORDER_DIRECTION_ASC,
      },
    });
    this.grpcSessionClient.listSessions(options).subscribe(console.log);
    return this.apiService.get<Pagination<FormattedSession>>(this.url, params);
  }

  /**
   * Used to get one session by id
   *
   * @param id Id of the session
   *
   * @returns Session
   */
  getOne(id: string): Observable<Session> {
    return this.apiService.get<Session>(
      `${this.url}/${encodeURIComponent(id)}`
    );
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
