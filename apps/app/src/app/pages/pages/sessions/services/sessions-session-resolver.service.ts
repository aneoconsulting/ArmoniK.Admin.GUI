import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { catchError, Observable } from 'rxjs';
import { ErrorService, Session, SessionsService } from '../../../../core';

@Injectable()
export class SessionsSessionResolver implements Resolve<Session | null> {
  constructor(
    private errorService: ErrorService,
    private sessionsService: SessionsService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Session | null> {
    return this.sessionsService
      .getOne(route.paramMap.get('session') ?? '')
      .pipe(catchError((error) => this.errorService.handleError(route, error)));
  }
}
