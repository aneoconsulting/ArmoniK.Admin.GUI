import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  public handleError<T>(operation: string, id: string | undefined = undefined) {
    return (error: HttpErrorResponse): Observable<T> => {
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
