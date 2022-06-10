// Type definition from proto file

import { Observable } from 'rxjs';

export interface Submitter {
  CancelSession(Session: Session): Observable<unknown>;
  CancelTasks(TaskFilter: TaskFilter): Observable<Record<string, never>>;
}

interface TaskFilter {
  task: {
    ids: string[];
  };
}
interface Session {
  Id: string;
}
