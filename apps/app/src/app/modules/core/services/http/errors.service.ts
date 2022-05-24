import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  /**
   * Used to return an controlled error message on error
   */
  public handleError(
    operation: string,
    id?: string
  ): (error: HttpErrorResponse) => Observable<never> {
    return (error: HttpErrorResponse) => {
      return throwError(() => {
        return {
          status: error.status,
          operation: operation,
          id: id,
        };
      });
    };
  }
}
