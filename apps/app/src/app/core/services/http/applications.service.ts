import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Application,
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

/**
 * Used to communicate with the API for applications
 */
@Injectable()
export class ApplicationsService {
  private url = '/api/applications';

  constructor(private apiService: ApiService) {}

  /**
   * Used to get the list of applications from the api
   *
   * @returns List of applications
   */
  getAll() {
    // return this.apiService.get<Application[]>(this.url);
    const data = new Observable<Application[]>((observer) => {
      observer.next([]);
      observer.complete();
    });
    return data;
  }
}
