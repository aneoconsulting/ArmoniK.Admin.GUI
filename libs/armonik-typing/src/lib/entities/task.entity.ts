import { TaskStatus } from '../enums';

export type RawTask = {
  _id: string;
  Options: TaskOptions;
  Status: TaskStatus;
  SessionId: string;
  CreationDate: Date;
  StartDate?: Date;
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
