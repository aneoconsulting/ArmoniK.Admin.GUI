import {TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TaskSummaryFiltersOr } from '@app/tasks/types';

export type Line = {
  name: string,
  interval: number,
  hideGroupsHeader: boolean,
  filters: TaskSummaryFiltersOr,
  taskStatusesGroups: TasksStatusesGroup[],
};

export type TasksStatusesGroup = {
  name: string;
  color?: string;
  statuses: TaskStatus[];
};

export type ManageGroupsDialogData = {
  groups: TasksStatusesGroup[];
};

export type ManageGroupsDialogResult = {
  groups: TasksStatusesGroup[];
};

export type StatusLabeled = { name: string, value: string };

export type AddStatusGroupDialogData = {
  statuses: StatusLabeled[];
};

export type EditStatusGroupDialogData = {
  group: TasksStatusesGroup;
  statuses: StatusLabeled[];
};
