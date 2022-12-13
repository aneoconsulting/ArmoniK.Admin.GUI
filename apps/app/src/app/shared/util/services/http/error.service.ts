import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class ErrorService {
  constructor(private router: Router) {}

  handleError(
    route: ActivatedRouteSnapshot,
    errorResponse: HttpErrorResponse
  ): Observable<null> {
    switch (errorResponse.status) {
      default: {
        console.error(errorResponse);
        this.router.navigate(['/', 'error']);
        return of(null);
      }
    }
  }
}
