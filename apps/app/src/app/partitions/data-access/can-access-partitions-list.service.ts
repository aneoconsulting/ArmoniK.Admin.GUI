import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthorizationService } from '../../shared/data-access';
import { RedirectService } from '../../shared/util';

// TODO: move to the correct folder
@Injectable()
export class CanActivatePartitionsListService implements CanActivate {
  constructor(
    private _authorizationService: AuthorizationService,
    private _redirectService: RedirectService
  ) { }

  canActivate(): boolean {
    const isAuthorized = this._authorizationService.canListPartitions();

    if (!isAuthorized) {
      this._redirectService.forbidden();
    }
    return isAuthorized;
  }
}
