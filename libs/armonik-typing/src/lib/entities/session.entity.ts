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
  lastActivity?: string;
};

export type SessionOptions = {
  [key: string]: any;
  MaxDuration: string;
  MaxRetries: number;
  Priority: number;
  Options: {
    [key: string]: any;
    MaxDuration: string;
    MaxRetries: number;
    Priority: string;
    GridAppName: string;
    GridAppVersion: string;
    GridAppNamespace: string;
  };
};

export type RawSession = {
  _id: string;
  Status: SessionStatus;
  Options: SessionOptions;
  CreationDate: string;
  CancellationDate: string;
};
