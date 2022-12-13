import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ExternalServicesEnum } from '../../enums';
import { ApiService } from './api.service';
import { HealthCheckResponse } from './types';

@Injectable()
export class GrafanaService {
  private url = '/grafana';

  constructor(private _apiService: ApiService) {}

  /**
   * Check if grafana is up and running
   *
   * @returns Observable
   */
  healthCheck$(): Observable<HealthCheckResponse> {
    const service = ExternalServicesEnum.GRAFANA;
    return this._apiService.head(this.url).pipe(
      map((res) => {
        return { isResponseOk: res.ok, service };
      }),
      catchError(() => {
        return of({ isResponseOk: false, service });
      })
    );
  }
}
