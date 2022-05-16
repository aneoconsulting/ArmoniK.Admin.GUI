import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorsService } from './errors.service';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { catchError, Observable, of } from 'rxjs';
import { AppSettingsService } from '../app-settings.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private url = 'api/applications';

  constructor(
    private http: HttpClient,
    private errorsService: ErrorsService,
    private appSettingsService: AppSettingsService
  ) {}

  index(): Observable<Application[]> {
    return this.http
      .get<Application[]>(this.url)
      .pipe(catchError(this.errorsService.handleError<Application[]>('index')));
  }

  show(id: string): Observable<Application | null> {
    if (!this.appSettingsService.isApplicationId(id)) return of(null);
    return this.http
      .get<Application>(`${this.url}/${id}`)
      .pipe(catchError(this.errorsService.handleError<Application>('show')));
  }
}
