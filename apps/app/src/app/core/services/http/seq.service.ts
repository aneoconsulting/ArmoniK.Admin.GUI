import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ExternalServices } from '../../enums';
import { ApiService } from './api.service';
import { HealthCheckResponse } from './types';

@Injectable()
export class SeqService {
  private url = '/seq';

  constructor(private _apiService: ApiService) {}

  /**
   * Check if seq is up and running
   *
   * @returns Observable
   */
  healthCheck$(): Observable<HealthCheckResponse> {
    const service = ExternalServices.SEQ;
    return this._apiService.head(this.url).pipe(
      catchError(() => {
        return of({ ok: false, service });
      }),
      map((res) => {
        return { ok: res.ok, service };
      })
    );
  }
}
