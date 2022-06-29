import { SessionStatus } from '../enums';

export type FormattedSession = {
  _id: string;
  countTasks?: number;
  countTasksPending: number;
  countTasksError: number;
  countTasksCompleted: number;
  countTasksProcessing: number;
  status: SessionStatus;
  createdAt: string;
  cancelledAt: string;
};
