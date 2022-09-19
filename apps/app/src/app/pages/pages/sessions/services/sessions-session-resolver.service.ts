import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { GetSessionResponse } from 'apps/app/src/app/core/types/proto/sessions-common.pb';
import { catchError, Observable } from 'rxjs';
import { ErrorService, SessionsService } from '../../../../core';

@Injectable()
export class SessionsSessionResolver
  implements Resolve<GetSessionResponse | null>
{
  constructor(
    private errorService: ErrorService,
    private sessionsService: SessionsService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<GetSessionResponse | null> {
    return this.sessionsService
      .getOne(route.paramMap.get('session') ?? '')
      .pipe(catchError((error) => this.errorService.handleError(route, error)));
  }
}
