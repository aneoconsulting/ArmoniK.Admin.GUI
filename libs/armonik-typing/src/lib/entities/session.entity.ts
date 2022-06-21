import { SessionStatus } from '../enums';

export type FormattedSession = {
  _id: string;
  countTasksPending: number;
  countTasksError: number;
  countTasksCompleted: number;
  countTasksProcessing: number;
  status: SessionStatus;
  createdAt: string;
  canceledAt: string;
};
