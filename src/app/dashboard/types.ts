import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type LineType = 'Applications' | 'Tasks' | 'Sessions' | 'Partitions' | 'Results';  

export type Line<T extends object, U extends object, K extends number> = {
  name: string,
  type: LineType
  interval: number,
  hideGroupsHeader?: boolean,
  filters: FiltersOr<K>,
  options?: ListOptions<T>;
  taskStatusesGroups?: TasksStatusesGroup[],
  displayedColumns?: ColumnKey<T, U>,
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
