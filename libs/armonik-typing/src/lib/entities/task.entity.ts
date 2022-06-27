import { TaskStatus } from '../enums';

export type Task = {
  _id: string;
  Options: TaskOptions;
  Status: TaskStatus;
  SessionId: string;
  StartDate: Date;
  EndDate?: Date;
};

export type TaskOptions = {
  [key: string]: unknown;
  Options: {
    [key: string]: unknown;
    GridAppName: string;
    GridAppVersion: string;
  };
};
