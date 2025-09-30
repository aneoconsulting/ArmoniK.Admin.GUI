import { ListApplicationsResponse, ListPartitionsResponse, ListResultsResponse, ListSessionsResponse, ListTasksResponse } from '@aneoconsultingfr/armonik.api.angular';
import { Params } from '@angular/router';
import { ApplicationRaw, } from '@app/applications/types';
import { PartitionRaw } from '@app/partitions/types';
import { ResultRaw } from '@app/results/types';
import { SessionRaw } from '@app/sessions/types';
import { TaskOptions, TaskRaw, TaskSummary, TaskSummaryFilters } from '@app/tasks/types';

export type PrefixedOptions<T> = `options.${keyof T extends string ? keyof T : never}`;

export type ColumnKey<T extends DataRaw, O extends TaskOptions | null = null> = keyof T | 'actions' | PrefixedOptions<O> | CustomColumn | 'count' | 'select';

export type FieldKey<T extends DataRaw | TaskOptions> = keyof T;

export type DataRaw = SessionRaw | ApplicationRaw | PartitionRaw | ResultRaw | TaskRaw | TaskSummary;

export type CustomColumn = `options.options.${string}`;

export interface ArmonikData<T extends DataRaw, O extends TaskOptions | null = null> {
  raw: T,
  queryParams?: Map<ColumnKey<T, O>, Params>;
}

interface ArmonikTaskByStatusData<T extends DataRaw, O extends TaskOptions | null = null> extends ArmonikData<T, O>{
  queryTasksParams: Record<string, string>;
  filters: TaskSummaryFilters;
}

export interface TaskData extends ArmonikData<TaskSummary, TaskOptions> {
  resultsQueryParams: Record<string, string>;
}

export interface SessionData extends ArmonikTaskByStatusData<SessionRaw, TaskOptions> {
  resultsQueryParams: Record<string, string>;
}

export type PartitionData = ArmonikTaskByStatusData<PartitionRaw>;

export type ApplicationData = ArmonikTaskByStatusData<ApplicationRaw>;

export type ResultData = ArmonikData<ResultRaw>;

export type GrpcResponse = ListApplicationsResponse | ListTasksResponse | ListSessionsResponse | ListPartitionsResponse | ListResultsResponse;

export type TaskOutput = {
  error: string;
  success: boolean;
}