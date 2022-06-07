import { TaskStatus } from '@armonik.admin.gui/armonik-typing';

export const PendingStatus = [
  TaskStatus.UNSPECIFIED,
  TaskStatus.CREATING,
  TaskStatus.SUBMITTED,
  TaskStatus.DISPATCHED,
] as const;
