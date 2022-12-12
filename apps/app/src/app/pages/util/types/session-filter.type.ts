import { SessionStatus } from './proto/session-status.pb';
import { TimeFilter } from './time-filter-type';

export type SessionFilter = {
  sessionId?: string;
  status?: SessionStatus;
  createdBefore?: TimeFilter;
  createdAfter?: TimeFilter;
  cancelledBefore?: TimeFilter;
  cancelledAfter?: TimeFilter;
};
