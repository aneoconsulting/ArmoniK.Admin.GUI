import { SessionStatus } from '../enums';
import { TaskOptions } from './task.entity';

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
  lastActivityAt?: string;
};

export type RawSession = {
  _id: string;
  Status: SessionStatus;
  Options: TaskOptions;
  CreationDate: string;
  CancellationDate: string;
};
