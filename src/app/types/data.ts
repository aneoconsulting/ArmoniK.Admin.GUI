import { ApplicationRaw } from '@app/applications/types';
import { PartitionRaw } from '@app/partitions/types';
import { SessionRaw } from '@app/sessions/types';
import { TaskRaw, TaskSummary, TaskSummaryFiltersOr } from '@app/tasks/types';

export type PrefixedOptions<T> = `options.${keyof T extends string ? keyof T : never}`;

export type ColumnKey<T extends object, O extends object = Record<string, never>> = keyof T | 'actions' | PrefixedOptions<O> | GenericColumn;

export type FieldKey<T extends object> = keyof T;

export type DataRaw = SessionRaw | ApplicationRaw | PartitionRaw | TaskRaw;

export type GenericColumn = `generic.${string}`;

interface ArmonikData<T extends DataRaw | TaskSummary> {
  raw: T,
}

interface ArmonikTaskByStatusData<T extends DataRaw> extends ArmonikData<T>{
  queryTasksParams: Record<string, string>;
  filters: TaskSummaryFiltersOr;
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