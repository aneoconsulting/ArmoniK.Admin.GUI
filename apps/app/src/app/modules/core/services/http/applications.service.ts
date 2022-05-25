import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { catchError } from 'rxjs';
import { ErrorsService } from './errors.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private url = 'api/applications';

  constructor(private http: HttpClient, private errorsService: ErrorsService) {}

  /**
   * Used to get the list of applications from the api
   */
  getAll() {
    return this.http
      .get<Application[]>(this.url)
      .pipe(catchError(this.errorsService.handleError('getAll')));
  }
}
