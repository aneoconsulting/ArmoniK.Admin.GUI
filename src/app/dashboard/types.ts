import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
// FIXME: Must be exported from @aneoconsultingfr/armonik-api-angular
import { StatusCount as GrpcStatusCount } from '@aneoconsultingfr/armonik.api.angular/lib/generated/objects.pb';

export type StatusCount = GrpcStatusCount.AsObject;

export type TasksStatusGroup = {
  name: string;
  color?: string;
  // FIXME: statuses
  status: TaskStatus[];
};

export type ManageGroupsDialogData = {
  groups: TasksStatusGroup[];
};

export type StatusLabeled = { name: string, value: string };

export type AddStatusGroupDialogData = {
  statuses: StatusLabeled[];
};

export type EditStatusGroupDialogData = {
  group: TasksStatusGroup;
  statuses: StatusLabeled[];
};