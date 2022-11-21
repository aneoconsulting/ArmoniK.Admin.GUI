import { Timestamp } from '@ngx-grpc/well-known-types';
import { SessionStatus } from './proto/session-status.pb';

export type SessionFilter = {
  sessionId?: string;
  status?: SessionStatus;
  createdBefore?: Timestamp;
  createdAfter?: Timestamp;
  closedBefore?: Timestamp;
  closedAfter?: Timestamp;
};
