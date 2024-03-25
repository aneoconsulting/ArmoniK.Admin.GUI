import { StatusCount as GrpcStatusCount, TaskOptions as GrpcTaskOptions, TaskDetailed as GrpcTaskRaw, TaskSummary as GrpcTaskSummary, TaskOptionEnumField, TaskOptionGenericField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey, FieldKey, PrefixedOptions } from '@app/types/data';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { Filter, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

export type TaskRaw = GrpcTaskRaw.AsObject;
export type TaskSummary = GrpcTaskSummary.AsObject;
export type TaskSummaryColumnKey = ColumnKey<TaskSummary, TaskOptions> | 'select' | `options.options.${string}`;
export type TaskSummaryFieldKey = FieldKey<TaskSummary>;
export type TaskSummaryListOptions = ListOptions<TaskSummary>;

export type TaskSummaryField = TaskSummaryEnumField | TaskOptionEnumField | string;

export type TaskFilterField = TaskSummaryEnumField | TaskOptionEnumField | TaskOptionGenericField | { for: string, index: number };
export type TaskFilterDefinition = FilterDefinition<TaskSummaryEnumField, TaskOptionEnumField>;

export type TaskFilterFor = FilterFor<TaskSummaryEnumField, TaskOptionEnumField>;
export type TaskSummaryFilters = FiltersOr<TaskSummaryEnumField, TaskOptionEnumField>;
export type TaskSummaryFilter = Filter<TaskSummaryEnumField, TaskOptionEnumField>;

export type TaskOptions = GrpcTaskOptions.AsObject;
export type StatusCount = GrpcStatusCount.AsObject;
export type PrefixedTaskOptions = PrefixedOptions<TaskOptions>;
