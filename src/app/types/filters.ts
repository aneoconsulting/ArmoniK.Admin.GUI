import { FilterArrayOperator, FilterBooleanOperator, FilterDateOperator, FilterDurationOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
import { FilterFor } from './filter-definition';

export type MaybeNull<T> = T | null;

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


// // Used to define filters available for the query builder.
// type FilterDefinitionBase<T, U = null> = {
//   // The couple key/field is used to know which field use for the filter. In fact, the key is the column name and the field, the id of the field.
//   key: T
//   field?: U
//   type: FilterType
// };

// export interface FiltersDefinitionString<T extends number, U> extends FilterDefinitionBase<T, U> {
//   type: 'string'
// }
// export interface FiltersDefinitionNumber<T, U> extends FilterDefinitionBase<T, U> {
//   type: 'number'
// }
// export interface FiltersDefinitionDate<T, U> extends FilterDefinitionBase<T, U> {
//   type: 'date'
// }
// export interface FiltersDefinitionStatus<T, U> extends FilterDefinitionBase<T, U> {
//   type: 'status'
//   statuses: FilterValueOptions;
// }
// export interface FiltersDefinitionArray<T, U> extends FilterDefinitionBase<T, U> {
//   type: 'array'
// }
// // Filters used to create the query builder.
// export type FiltersDefinition<T extends number, U = null> = FiltersDefinitionString<T, U> | FiltersDefinitionNumber<T, U> | FiltersDefinitionDate<T, U> | FiltersDefinitionStatus<T, U> | FiltersDefinitionArray<T, U>;

// Value of a filter input.
export type FilterInputValueString = MaybeNull<string>;
export type FilterInputValueNumber = MaybeNull<number>;
export type FilterInputValueDate = MaybeNull<Date>;
export type FilterInputValueDuration = MaybeNull<number>;

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

export interface FilterInputDuration {
  type: 'duration';
  value: FilterInputValueDuration
}
export type FilterInput = FilterInputString | FilterInputNumber | FilterInputDate | FilterInputStatus | FilterInputDuration;

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

export interface FilterInputOutputDuration {
  type: 'duration';
  value: MaybeNull<number>
}

export type FilterInputOutput = FilterInputOutputString | FilterInputOutputNumber | FilterInputOutputDate | FilterInputOutputDuration;
