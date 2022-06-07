// Type definition from proto file

import { Observable } from 'rxjs';

export interface Submitter {
  CancelSession(Session: Session): Observable<unknown>;
}

interface Session {
  Id: string;
}
