import { Injectable } from '@angular/core';
import { Application, Pagination } from '@armonik.admin.gui/armonik-typing';
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
    applicationId: Application['_id'],
    page: number = 1,
    limit: number = 10
  ): Observable<Pagination<Session>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      applicationName: applicationId.applicationName,
      applicationVersion: applicationId.applicationVersion,
    });

    return this.apiService.get<Pagination<Session>>(
      `${this.url}?${params.toString()}`
    );
  }

  /**
   * Used to get one session by id
   *
   * @param id Id of the session
   *
   * @returns Session
   */
  getOne(id: string): Observable<Session> {
    return this.apiService.get<Session>(`${this.url}/${id}`);
  }
}
