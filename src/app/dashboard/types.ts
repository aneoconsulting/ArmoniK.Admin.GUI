import {TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ApplicationRawFilter } from '@app/applications/types';
import { TaskSummaryFiltersOr } from '@app/tasks/types';

export type Line = {
  name: string,
  type: 'Applications' | 'Tasks',
  interval: number,
  hideGroupsHeader?: boolean,
  filters: TaskSummaryFiltersOr | ApplicationRawFilter,
  taskStatusesGroups?: TasksStatusesGroup[],
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
