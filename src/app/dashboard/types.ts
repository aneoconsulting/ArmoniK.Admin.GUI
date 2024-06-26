import { ApplicationRawEnumField, PartitionRawEnumField, ResultRawEnumField, SessionRawEnumField, SessionTaskOptionEnumField, TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ApplicationRaw, ApplicationRawFilters } from '@app/applications/types';
import { PartitionRaw } from '@app/partitions/types';
import { ResultRaw } from '@app/results/types';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions, TaskSummary } from '@app/tasks/types';
import { CustomColumn, IndexListOptions, RawColumnKey } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { TableType } from '@app/types/table';

export type LineType = TableType | 'CountStatus';
export type Summary = TaskSummary | ApplicationRaw | PartitionRaw | SessionRaw | ResultRaw;
export type SummaryOptions = TaskOptions;
export type FiltersEnums = ApplicationRawEnumField | PartitionRawEnumField | SessionRawEnumField | TaskSummaryEnumField | ResultRawEnumField;
export type FiltersOptionsEnums = SessionTaskOptionEnumField | TaskOptionEnumField | null;

export type Line = {
  name: string,
  type: LineType
  interval: number,
  hideGroupsHeader?: boolean,
  filters: FiltersOr<FiltersEnums, FiltersOptionsEnums> | ApplicationRawFilters,
  options?: IndexListOptions;
  taskStatusesGroups?: TasksStatusesGroup[],
  displayedColumns?: RawColumnKey[],
  customColumns?: CustomColumn[],
  lockColumns?: boolean;
  showFilters?: boolean;
};

export type TasksStatusesGroup = {
  name: string;
  color?: string;
  statuses: TaskStatus[];
  statusCount?: number;
  queryParams?: Record<string, string>;
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
