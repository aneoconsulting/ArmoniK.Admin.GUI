import { Injectable } from '@angular/core';
import { AuthorizationService } from '../../shared/data-access';
import { RedirectService } from '../../shared/util';

@Injectable({
  providedIn: 'root',
})
export class CanActivateSessionsListService {
  constructor(
    private _authorizationService: AuthorizationService,
    private _redirectService: RedirectService
  ) {}

  canActivate(): boolean {
    const isAuthorized = !this._authorizationService.canListSessions();

    if (isAuthorized) {
      this._redirectService.forbidden();
    }

    return !isAuthorized;
  }
}
