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
   * @param applicationName Name of the app
   * @param page Page number
   * @param limit Number of items per page
   *
   * @returns Pagination of sessions
   */
  getAllPaginated(
    applicationName: Application['_id'],
    page: number = 1,
    limit: number = 10
  ): Observable<Pagination<Session>> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      appName: applicationName,
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
