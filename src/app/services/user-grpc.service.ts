import { AuthenticationClient, GetCurrentUserRequest, GetCurrentUserResponse } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserGrpcService {
  constructor(
    private _authenticationService: AuthenticationClient,
  ) {}

  me$(): Observable<GetCurrentUserResponse> {
    const request = new GetCurrentUserRequest();
    return this._authenticationService.getCurrentUser(request);
  }
}
