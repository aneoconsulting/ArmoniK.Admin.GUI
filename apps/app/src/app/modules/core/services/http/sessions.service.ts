import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Session } from '@armonik.admin.gui/armonik-typing';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private url = 'api/sessions';

  constructor(private http: HttpClient, private errorsService: ErrorsService) {}

  getSessions(): Observable<Session[]> {
    return this.http
      .get<Session[]>(this.url)
      .pipe(
        catchError(this.errorsService.handleError<Session[]>('getSessions'))
      );
  }

  close(id: Session['id']): Observable<Session> {
    return this.http
      .post<Session>(`${this.url}/${id}/close`, null)
      .pipe(catchError(this.errorsService.handleError<Session>('close')));
  }

  reopen(id: Session['id']): Observable<Session> {
    return this.http
      .post<Session>(`${this.url}/${id}/reopen`, null)
      .pipe(catchError(this.errorsService.handleError<Session>('reopen')));
  }
}
