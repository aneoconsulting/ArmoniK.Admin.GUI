import {TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ApplicationRawColumnKey, ApplicationRawFilter, ApplicationRawListOptions } from '@app/applications/types';
import { TaskSummaryFiltersOr } from '@app/tasks/types';

export type Line = {
  name: string,
  type: 'Applications' | 'Tasks',
  interval: number,
  hideGroupsHeader?: boolean,
  filters: TaskSummaryFiltersOr | ApplicationRawFilter,
  options?: ApplicationRawListOptions;
  taskStatusesGroups?: TasksStatusesGroup[],
  displayedColumns?: ApplicationRawColumnKey[],
  lockColumns?: boolean;
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
