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
  MaxDuration: string;
  MaxRetries: number;
  Priority: number;
  PartitionId: string;
  ApplicationName: string;
  ApplicationVersion: string;
  ApplicationNamespace: string;
  ApplicationService: string;
  EngineType: string;
};
