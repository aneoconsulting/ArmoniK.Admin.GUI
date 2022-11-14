import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CancelSessionRequest,
  CancelSessionResponse,
} from '../../types/proto/sessions-common.pb';
import { SessionsClient } from '../../types/proto/sessions-service.pbsc';

@Injectable()
export class GrpcSessionsService {
  constructor(private _sessionsClient: SessionsClient) {}

  public cancel$(sessionId: string): Observable<CancelSessionResponse> {
    const options = new CancelSessionRequest({
      sessionId,
    });

    return this._sessionsClient.cancelSession(options);
  }
}
