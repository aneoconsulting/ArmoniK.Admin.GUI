import { ApplicationRawEnumField, FilterArrayOperator, FilterBooleanOperator, FilterDateOperator, FilterDurationOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, PartitionRawEnumField, ResultRawEnumField, SessionRawEnumField, SessionTaskOptionEnumField, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { FilterFor } from './filter-definition';

export type MaybeNull<T> = T | null;

export type FiltersEnums = ApplicationRawEnumField | PartitionRawEnumField | SessionRawEnumField | TaskSummaryEnumField | ResultRawEnumField;
export type FiltersOptionsEnums = SessionTaskOptionEnumField | TaskOptionEnumField | null;

export type FilterType = 'string' | 'number' | 'date' | 'array' | 'status' | 'boolean' | 'duration';
export type FilterValueOptions = { key: string | number, value: string }[];

export type FilterOperators = FilterStringOperator | FilterNumberOperator | FilterDateOperator | FilterArrayOperator | FilterStatusOperator | FilterBooleanOperator | FilterDurationOperator;

/**
 * Used to define the filter FOR (a group of AND).
 */
export type FiltersOr<T extends FiltersEnums, U extends FiltersOptionsEnums | null = null> = FiltersAnd<T, U>[];
/**
 * Used to define the filter AND (a group of filters).
 */
export type FiltersAnd<T extends FiltersEnums, U extends FiltersOptionsEnums | null> = Filter<T, U>[];

/**
 * Filters used to filter the data.
 *
 * `for` and `field` are used to identify the filter.
 */
export type Filter<T extends FiltersEnums, U extends FiltersOptionsEnums | null = null> = {
  for: FilterFor<T, U> | null
  field: T | U | string | null
  value: MaybeNull<FilterInputValue>
  operator: MaybeNull<number>
};

// Input for a filter input.
export interface FilterInputString {
  type: 'string' | 'array';
  value: MaybeNull<string>;
}
export interface FilterInputNumber {
  type: 'number';
  value: MaybeNull<number>;
}
export interface FilterInputDate {
  type: 'date';
  value: MaybeNull<Date>;
}
export interface FilterInputStatus {
  type: 'status';
  value: MaybeNull<string>;
}
export interface FilterInputBoolean {
  type: 'boolean';
  value: MaybeNull<boolean>;
}

export interface FilterInputDuration {
  type: 'duration';
  value: MaybeNull<number>;
}
export type FilterInput = FilterInputString | FilterInputNumber | FilterInputDate | FilterInputStatus | FilterInputDuration | FilterInputBoolean;

export type FilterInputValue = FilterInput['value'];