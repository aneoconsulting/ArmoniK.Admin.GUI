import { Injectable } from '@angular/core';
import { AuthorizationService } from '../../shared/data-access';
import { RedirectService } from '../../shared/util';

@Injectable({
  providedIn: 'root',
})
export class CanActivateResultsListService {
  constructor(
    private _authorizationService: AuthorizationService,
    private _redirectService: RedirectService
  ) {}

  canActivate(): boolean {
    const isAuthorized = this._authorizationService.canListResults();

    if (!isAuthorized) {
      this._redirectService.forbidden();
    }

    return isAuthorized;
  }
}
