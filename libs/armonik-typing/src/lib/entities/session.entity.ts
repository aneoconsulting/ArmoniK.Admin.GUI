export type FormattedSession = {
  _id: string;
  countTasksPending: number;
  countTasksError: number;
  countTasksCompleted: number;
  countTasksProcessing: number;
  status: number;
  createdAt: string;
  cancelledAt: string;
};
