import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  public handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      return throwError(
        () => new Error(`${operation} failed: ${error.message}`)
      );
    };
  }
}
