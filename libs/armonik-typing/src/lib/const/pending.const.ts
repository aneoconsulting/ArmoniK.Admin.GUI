import { TaskStatus } from '../enums';

export const PendingStatus = [
  TaskStatus.UNSPECIFIED,
  TaskStatus.CREATING,
  TaskStatus.SUBMITTED,
  TaskStatus.DISPATCHED,
] as const;
