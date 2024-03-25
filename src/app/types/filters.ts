import { FilterArrayOperator, FilterBooleanOperator, FilterDateOperator, FilterDurationOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
import { ApplicationRawFilters } from '@app/applications/types';
import { PartitionRawFilters } from '@app/partitions/types';
import { ResultRawFilters } from '@app/results/types';
import { SessionRawFilters } from '@app/sessions/types';
import { TaskSummaryFilters } from '@app/tasks/types';
import { FilterFor } from './filter-definition';

export type MaybeNull<T> = T | null;

export type RawFilters = SessionRawFilters | TaskSummaryFilters | PartitionRawFilters | ApplicationRawFilters | ResultRawFilters;

export type FilterType = 'string' | 'number' | 'date' | 'array' | 'status' | 'boolean' | 'duration';
export type FilterValueOptions = { key: string | number, value: string }[];

export type FilterOperators = FilterStringOperator | FilterNumberOperator | FilterDateOperator | FilterArrayOperator | FilterStatusOperator | FilterBooleanOperator | FilterDurationOperator;

/**
 * Used to define the filter FOR (a group of AND).
 */
export type FiltersOr<T extends number, U extends number | null = null> = FiltersAnd<T, U>[];
/**
 * Used to define the filter AND (a group of filters).
 */
export type FiltersAnd<T extends number, U extends number | null> = Filter<T, U>[];

/**
 * Filters used to filter the data.
 *
 * `for` and `field` are used to identify the filter.
 */
export type Filter<T extends number, U extends number | null = null> = {
  for: FilterFor<T, U> | null
  field: T | U | string | null
  value: MaybeNull<FilterInputValue>
  operator: MaybeNull<number>
};

// Value of a filter input.
export type FilterInputValueString = MaybeNull<string>;
export type FilterInputValueNumber = MaybeNull<number>;
export type FilterInputValueDate = MaybeNull<Date>;
export type FilterInputValueDuration = MaybeNull<number>;
export type FilterInputValueBoolean = MaybeNull<boolean>;

// Input for a filter input.
export interface FilterInputString {
  type: 'string' | 'array';
  value: FilterInputValueString;
}
export interface FilterInputNumber {
  type: 'number';
  value: FilterInputValueNumber;
}
export interface FilterInputDate {
  type: 'date';
  value: FilterInputValueDate;
}
export interface FilterInputStatus {
  type: 'status';
  value: MaybeNull<string>;
  statuses: FilterValueOptions;
}
export interface FilterInputBoolean {
  type: 'boolean';
  value: FilterInputValueBoolean;
}

export interface FilterInputDuration {
  type: 'duration';
  value: FilterInputValueDuration
}
export type FilterInput = FilterInputString | FilterInputNumber | FilterInputDate | FilterInputStatus | FilterInputDuration | FilterInputBoolean;

export type FilterInputValue = FilterInput['value'];
export type FilterInputType = FilterInput['type'];


export interface FilterInputOutputString {
  type: 'string' | 'array';
  value: MaybeNull<string>;
}
export interface FilterInputOutputNumber {
  type: 'number';
  value: MaybeNull<number>;
}
export interface FilterInputOutputDate {
  type: 'date';
  value: MaybeNull<number>;
}

export interface FilterInputOutputStatus {
  type: 'status';
  value: MaybeNull<string>;
}
export interface FilterInputOutputDuration {
  type: 'duration';
  value: MaybeNull<number>
}
export interface FilterInputOutputBoolean {
  type: 'boolean';
  value: MaybeNull<boolean>;
}

export type FilterInputOutput = FilterInputOutputString | FilterInputOutputNumber | FilterInputOutputDate | FilterInputOutputDuration | FilterInputOutputStatus | FilterInputOutputBoolean;
