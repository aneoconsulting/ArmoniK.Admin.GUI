import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Logger } from '@nestjs/common';

@Injectable()
export class ErrorService {
  private readonly logger = new Logger(ErrorService.name);

  constructor(private router: Router) {}

  handleError(
    route: ActivatedRouteSnapshot,
    errorResponse: HttpErrorResponse
  ): Observable<null> {
    switch (errorResponse.status) {
      default: {
        this.logger.error(errorResponse);
        this.router.navigate(['/', 'error']);
        return of(null);
      }
    }
  }
}
