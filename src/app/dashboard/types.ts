import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ApplicationRaw } from '@app/applications/types';
import { PartitionRaw } from '@app/partitions/types';
import { ResultRaw } from '@app/results/types';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions, TaskSummary } from '@app/tasks/types';
import { ColumnKey, CustomColumn, DataRaw } from '@app/types/data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { TableType } from '@app/types/table';

export type LineType = TableType | 'CountStatus';
export type Summary = TaskSummary | ApplicationRaw | PartitionRaw | SessionRaw | ResultRaw;
export type SummaryOptions = TaskOptions;

export interface Line {
  name: string;
  type: LineType;
  interval: number;
  filters: FiltersOr<FiltersEnums, FiltersOptionsEnums>;
  showFilters?: boolean;
}

export interface CountLine extends Line {
  hideGroupsHeader?: boolean;
  taskStatusesGroups?: TasksStatusesGroup[];
}

export interface TableLine<T extends DataRaw, O extends TaskOptions | null = null> extends Line {
  options?: ListOptions<T, O>;
  displayedColumns?: ColumnKey<T, O>[],
  lockColumns?: boolean;
  customColumns?: CustomColumn[],
}

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
