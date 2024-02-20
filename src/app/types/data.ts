import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawListOptions } from '@app/applications/types';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawListOptions } from '@app/partitions/types';
import { ResultRaw, ResultRawColumnKey, ResultRawListOptions } from '@app/results/types';
import { SessionRaw, SessionRawColumnKey, SessionRawListOptions } from '@app/sessions/types';
import { TaskRaw, TaskSummary, TaskSummaryColumnKey, TaskSummaryFiltersOr, TaskSummaryListOptions } from '@app/tasks/types';

export type PrefixedOptions<T> = `options.${keyof T extends string ? keyof T : never}`;

export type ColumnKey<T extends object, O extends object = Record<string, never>> = keyof T | 'actions' | PrefixedOptions<O> | GenericColumn;

export type FieldKey<T extends object> = keyof T;

export type DataRaw = SessionRaw | ApplicationRaw | PartitionRaw | ResultRaw | TaskRaw;

export type GenericColumn = `generic.${string}`;

interface ArmonikData<T extends DataRaw | TaskSummary> {
  raw: T,
}

interface ArmonikTaskByStatusData<T extends DataRaw> extends ArmonikData<T>{
  queryTasksParams: Record<string, string>;
  filters: TaskSummaryFilters;
}

export interface TaskData extends ArmonikData<TaskSummary> {
  resultsQueryParams: Record<string, string>;
}

export interface SessionData extends ArmonikTaskByStatusData<SessionRaw> {
  resultsQueryParams: Record<string, string>;
}

export interface PartitionData extends ArmonikTaskByStatusData<PartitionRaw> {
}

export interface ApplicationData extends ArmonikTaskByStatusData<ApplicationRaw> {
}

export type RawColumnKey = SessionRawColumnKey | TaskSummaryColumnKey | ApplicationRawColumnKey | PartitionRawColumnKey | ResultRawColumnKey;
export type IndexListOptions = TaskSummaryListOptions | SessionRawListOptions | ApplicationRawListOptions | ResultRawListOptions | PartitionRawListOptions;