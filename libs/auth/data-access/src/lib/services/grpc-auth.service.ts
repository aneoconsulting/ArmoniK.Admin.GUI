import { Injectable } from '@angular/core';
import {
  AuthenticationClient,
  BaseGrpcService,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
} from '@armonik.admin.gui/shared/data-access';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcAuthService extends BaseGrpcService {
  constructor(private _authClient: AuthenticationClient) {
    super();
  }

  public currentUser$(): Observable<GetCurrentUserResponse> {
    const options = new GetCurrentUserRequest();

    return this._authClient
      .getCurrentUser(options)
      .pipe(takeUntil(this._timeout$));
  }
}
