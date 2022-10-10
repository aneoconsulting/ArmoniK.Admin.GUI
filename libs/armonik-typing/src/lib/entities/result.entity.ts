import { ResultStatus } from '../enums/result-status.enum';

export type FormattedResult = {
  _id: string;
  SessionId: string;
  Name: string;
  OwnerTaskId: string;
  Status: ResultStatus;
  CreationDate: string;
  Data: string;
};
