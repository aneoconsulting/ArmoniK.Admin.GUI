import { ApplicationRawEnumField, PartitionRawEnumField, ResultRawEnumField, SessionRawEnumField, TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFilters, ApplicationRawListOptions } from '@app/applications/types';
import { PartitionRaw } from '@app/partitions/types';
import { ResultRaw } from '@app/results/types';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions, TaskSummary } from '@app/tasks/types';
import { ColumnKey } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type LineType = 'Applications' | 'Tasks' | 'Sessions' | 'Partitions' | 'Results' | 'CountStatus';
export type Summary = TaskSummary | ApplicationRaw | PartitionRaw | SessionRaw | ResultRaw;
export type SummaryOptions = TaskOptions;
export type FiltersEnums = ApplicationRawEnumField | PartitionRawEnumField | SessionRawEnumField | TaskSummaryEnumField | ResultRawEnumField;
export type FiltersOptionsEnums = TaskOptionEnumField | null;

export type Line = {
  name: string,
  type: LineType
  interval: number,
  hideGroupsHeader?: boolean,
  filters: FiltersOr<FiltersEnums, FiltersOptionsEnums> | ApplicationRawFilters,
  options?: ListOptions<Summary> | ApplicationRawListOptions;
  taskStatusesGroups?: TasksStatusesGroup[],
  displayedColumns?: ColumnKey<Summary, SummaryOptions> | ApplicationRawColumnKey[],
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
