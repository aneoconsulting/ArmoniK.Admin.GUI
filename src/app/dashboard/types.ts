import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
// FIXME: Must be exported from @aneoconsultingfr/armonik-api-angular
// @see https://github.com/aneoconsulting/ArmoniK.Api/pull/259
import { StatusCount as GrpcStatusCount } from '@aneoconsultingfr/armonik.api.angular/lib/generated/objects.pb';

export type StatusCount = GrpcStatusCount.AsObject;

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
