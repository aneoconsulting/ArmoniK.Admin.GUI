import { SessionStatus } from './proto/session-status.pb';

export type SessionFilter = {
  sessionId?: string;
  status?: SessionStatus;
  createdBefore?: { nano: number; seconds: string };
  createdAfter?: { nano: number; seconds: string };
  cancelledBefore?: { nano: number; seconds: string };
  cancelledAfter?: { nano: number; seconds: string };
};
