import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private url = 'api/sessions';

  constructor(private http: HttpClient, private errorsService: ErrorsService) {}

  close(id: string) {
    return this.http
      .post(`${this.url}/${id}/close`, null)
      .pipe(catchError(this.errorsService.handleError('close', [])));
  }

  reopen(id: string) {
    return this.http
      .post(`${this.url}/${id}/reopen`, null)
      .pipe(catchError(this.errorsService.handleError('reopen', [])));
  }
}
