import {TaskStatus } from '@aneoconsultingfr/armonik.api.angular';



export type TasksStatusesGroup = {
  name: string;
  color?: string;
  statuses: TaskStatus[];
};

export type ManageGroupsDialogData = {
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
