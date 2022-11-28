export type SessionPageFilter = {
  sessionId?: string;
  status?: number;
  createdAtBefore?: number;
  createdAtAfter?: number;
  cancelledAtBefore?: number;
  cancelledAtAfter?: number;
};
