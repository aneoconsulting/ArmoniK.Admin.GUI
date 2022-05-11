import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // console.log(`${operation} failed: ${error.message}`);

      // return throwError(
      //   () => new Error(`${operation} failed: ${error.message}`)
      // );

      // Let the app keep running by returning an empty result.
      return throwError(
        () => new Error(`${operation} failed: ${error.message}`)
      );
    };
  }
}
