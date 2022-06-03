import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

/**
 * Interface to allow error handling and remove dependency on the http client
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * Used to format the error response
   *
   * @param error Error response
   */
  private formatErrors(error: HttpErrorResponse) {
    return throwError(() => ({
      status: error.status,
    }));
  }

  /**
   * Used to create a get request
   *
   * @param path Path of the request
   * @param params Parameters of the request
   *
   * @returns Response of the request
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http
      .get<T>(path, { params })
      .pipe(catchError(this.formatErrors));
  }
}
