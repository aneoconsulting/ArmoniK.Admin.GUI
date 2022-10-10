import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormattedResult, Pagination } from '@armonik.admin.gui/armonik-typing';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class ResultsService {
  private url = '/api/results';

  constructor(private apiService: ApiService) {}

  /**
   * Used to get the list of results from the api using pagination and filters
   *
   * @returns Pagination of results
   */
  getAllPaginated(
    params: HttpParams = new HttpParams()
  ): Observable<Pagination<FormattedResult>> {
    return this.apiService.get<Pagination<FormattedResult>>(this.url, params);
  }
}
