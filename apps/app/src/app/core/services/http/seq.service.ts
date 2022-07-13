import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class SeqService {
  private url = '/api/seq';

  constructor(private apiService: ApiService) {}

  /**
   * Check if seq is up and running
   */
  ping(): Observable<{ status: string }> {
    return this.apiService.get<{ status: string }>(this.url + '/ping');
  }
}
