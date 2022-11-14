import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empty, Session } from '../../types/proto/objects.pb';
import { SubmitterClient } from '../../types/proto/submitter-service.pbsc';

@Injectable()
export class GrpcSessionsService {
  constructor(private _sessionsClient: SubmitterClient) {}

  public cancel$(sessionId: string): Observable<Empty> {
    const options = new Session({
      id: sessionId,
    });

    return this._sessionsClient.cancelSession(options);
  }
}
