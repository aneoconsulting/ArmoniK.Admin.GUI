// Type definition from proto file

import { TaskStatus } from '@armonik.admin.gui/armonik-typing';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export interface Submitter {
  CancelSession(Session: Session, metadata: Metadata): Observable<unknown>;
  CancelTasks(TaskFilter: TaskFilter): Observable<Record<string, never>>;
}

interface TaskFilter {
  task: {
    ids: string[];
  };
  included: {
    statuses: readonly TaskStatus[];
  };
}
interface Session {
  id: string;
}
