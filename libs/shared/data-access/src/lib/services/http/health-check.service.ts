import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ExternalServicesEnum } from '../../enums';
import { HealthCheckResponse } from '../../types';
import { ApiService } from './api.service';

@Injectable()
export class HealthCheckService {
  constructor(private _apiService: ApiService) {}

  /**
   * Check if a service behind a given url is up and running
   *
   * @param url Url of the service
   * @param service Name of the service
   *
   * @returns Observable
   */
  healthCheck$(
    url: string,
    service: ExternalServicesEnum
  ): Observable<HealthCheckResponse> {
    return this._apiService.head(url).pipe(
      map((res) => {
        return { isResponseOk: res.ok, service };
      }),
      catchError(() => {
        return of({ isResponseOk: false, service });
      })
    );
  }
}
