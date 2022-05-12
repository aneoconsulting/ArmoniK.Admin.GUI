import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorsService } from './errors.service';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private url = 'api/applications';

  constructor(private http: HttpClient, private errorsService: ErrorsService) {}

  index(): Observable<Application[]> {
    return this.http
      .get<Application[]>(this.url)
      .pipe(catchError(this.errorsService.handleError<Application[]>('index')));
  }
}
