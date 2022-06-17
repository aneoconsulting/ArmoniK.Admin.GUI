import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  FormattedSession,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { Observable } from 'rxjs';
import { Session } from '../../models';
import { ApiService } from './api.service';

@Injectable()
export class SessionsService {
  private url = '/api/sessions';

  constructor(private apiService: ApiService) {}

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
  cancel(id: string): Observable<Session> {
    return this.apiService.put<Session>(
      `${this.url}/${encodeURIComponent(id)}/cancel`
    );
  }
}
