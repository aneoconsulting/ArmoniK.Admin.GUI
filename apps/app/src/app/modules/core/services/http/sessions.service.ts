import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { catchError, Observable } from 'rxjs';
import { Session } from '../../entities';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private url = 'api/sessions';

  constructor(private http: HttpClient, private errorsService: ErrorsService) {}

  /**
   * Used to get the list of sessions from the api using pagination (page and limit)
   */
  getAllPaginated(
    appName: string,
    page: number = 1,
    limit: number = 10
  ): Observable<Pagination<Session>> {
    return this.http
      .get<Pagination<Session>>(
        `${this.url}?page=${page}&limit=${limit}&appName=${appName}`
      )
      .pipe(
        catchError(this.errorsService.handleError('getAllPaginated', appName))
      );
  }
}
