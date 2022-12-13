import {
  SessionStatus,
  TimeFilter,
} from '@armonik.admin.gui/shared/data-access';

export type SessionFilter = {
  applicationName?: string;
  applicationVersion?: string;
  sessionId?: string;
  status?: SessionStatus;
  createdBefore?: TimeFilter;
  createdAfter?: TimeFilter;
  cancelledBefore?: TimeFilter;
  cancelledAfter?: TimeFilter;
};
