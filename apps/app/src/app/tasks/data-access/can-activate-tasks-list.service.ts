import { Injectable } from '@angular/core';
import { RedirectService } from '../../shared/util';
import { AuthorizationService } from '../../shared/data-access';

@Injectable({
  providedIn: 'root',
})
export class CanActivateTasksListService {
  constructor(
    private _authorizationService: AuthorizationService,
    private _redirectService: RedirectService
  ) {}

  canActivate(): boolean {
    const isAuthorized = this._authorizationService.canListTasks();

    if (!isAuthorized) {
      this._redirectService.forbidden();
    }

    return isAuthorized;
  }
}
