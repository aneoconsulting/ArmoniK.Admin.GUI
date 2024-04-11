import { ApplicationFilterField, PartitionFilterField, ResultFilterField , ResultStatus, SessionFilterField, SessionStatus, TaskFilterField, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Params } from '@angular/router';
import { Subject } from 'rxjs';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFilters , ApplicationRawListOptions} from '@app/applications/types';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFilters , PartitionRawListOptions} from '@app/partitions/types';
import { ResultRaw, ResultRawColumnKey, ResultRawFilters , ResultRawListOptions} from '@app/results/types';
import { SessionRaw, SessionRawColumnKey, SessionRawFilters , SessionRawListOptions} from '@app/sessions/types';
import { TaskRaw, TaskSummary, TaskSummaryColumnKey, TaskSummaryFilters, TaskSummaryListOptions } from '@app/tasks/types';

export type PrefixedOptions<T> = `options.${keyof T extends string ? keyof T : never}`;

export type ColumnKey<T extends object, O extends object = Record<string, never>> = keyof T | 'actions' | PrefixedOptions<O> | CustomColumn;

export type FieldKey<T extends DataRaw> = keyof T;

export type DataRaw = SessionRaw | ApplicationRaw | PartitionRaw | ResultRaw | TaskRaw | TaskSummary;

export type CustomColumn = `options.options.${string}`;

export interface ArmonikData<T extends DataRaw> {
  raw: T,
  value$: Subject<T>;
  queryParams?: Map<ColumnKey<T>, Params>;
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

export interface ResultData extends ArmonikData<ResultRaw> {
}

export type RawColumnKey = SessionRawColumnKey | TaskSummaryColumnKey | ApplicationRawColumnKey | PartitionRawColumnKey | ResultRawColumnKey;
export type IndexListOptions = TaskSummaryListOptions | SessionRawListOptions | ApplicationRawListOptions | ResultRawListOptions | PartitionRawListOptions;

export type Status = TaskStatus | SessionStatus | ResultStatus;
export type IndexListFilters = SessionRawFilters | TaskSummaryFilters | PartitionRawFilters | ApplicationRawFilters | ResultRawFilters;

export type DataFilterField = ApplicationFilterField.AsObject | SessionFilterField.AsObject | ResultFilterField.AsObject | PartitionFilterField.AsObject | TaskFilterField.AsObject;
