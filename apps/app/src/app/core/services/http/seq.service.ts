import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class SeqService {
  private url = '/seq';

  constructor(private _apiService: ApiService) {}

  /**
   * Check if seq is up and running
   *
   * @returns Observable
   */
  healthCheck$(): Observable<{ ok: boolean; service: 'seq' }> {
    return this._apiService.head(this.url).pipe(
      catchError(() => {
        return of({ ok: false });
      }),
      map((res) => {
        return { ok: res.ok, service: 'seq' };
      })
    );
  }
}
