import { DateTime } from 'luxon';
import { FieldKey } from './data';

// Filters used to filter the data.
export type Filter<T extends object> = {
  field: FieldKey<T> | null
  value?: FilterInputValue
};

export type FilterFieldText<T extends object> = {
  field: FieldKey<T>
  type: 'text'
};
export type FilterFieldNumber<T extends object> = {
  field: FieldKey<T>
  type: 'number'
};
export type FilterFieldDate<T extends object> = {
  field: FieldKey<T>
  type: 'date'
};
// Filters used to create the query builder.
export type FilterField<T extends object> = FilterFieldText<T> | FilterFieldNumber<T> | FilterFieldDate<T>;

// Types for the value of an input.
export type FilterInputValueText = string | null;
export type FilterInputValueNumber = number | null;
export type FilterInputValueDate = { start: string | null, end: string | null };

// Types for the input.
export interface FilterInputText {
  type: 'text';
  value: FilterInputValueText;
}
export interface FilterInputNumber {
  type: 'number';
  value: FilterInputValueNumber;
}
export interface FilterInputDate  {
  type: 'date';
  value: FilterInputValueDate;
}
export type FilterInput = FilterInputText | FilterInputNumber | FilterInputDate;

export type FilterInputValue = FilterInput['value'];
export type FilterInputType = FilterInput['type'];

// Types for the output.
export type FilterEventText = {
  type: 'text';
  value: string;
};
export type FilterEventNumber = {
  type: 'number';
  value: number;
};
export type DateType = 'start' | 'end';
export type FilterEventDate = {
  type: `date-${DateType}`;
  value: DateTime | null;
};
export type FilterEvent = FilterEventText | FilterEventNumber | FilterEventDate;
