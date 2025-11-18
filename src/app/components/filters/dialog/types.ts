import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FilterFor } from '@app/types/filter-definition';
import { FilterFieldValue, FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';

/**
 * Array of FormFiltersAnd. Represents an "Or" filter.
 */
export type FormFiltersOr<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> = FormArray<FormFiltersAnd<F, O>>;

/**
 * Array of FormFilter. Represents an "And" filter.
 */
export type FormFiltersAnd<F extends FiltersEnums, O extends FiltersOptionsEnums | null> = FormArray<FormFilter<F, O>>;

/**
 * Angular FormGroup allowing to use in a more simplier way the forms from FormFilterType.
 */
export type FormFilter<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> = FormGroup<FormFilterType<F, O>>;

/**
 * Type containing all forms information about a filter.
 * - for: FilterFor<FiltersEnum, FiltersOptionsEnums> | null
 * - field: FilterFieldValue<FiltersEnum, FiltersOptionsEnums>
 * - value: FilterInputValue
 * - operator: number | null
 */
export type FormFilterType<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> = {
  for: FormControl<FilterFor<F, O> | null>;
  field: FormControl<FilterFieldValue<F, O>>;
  value: FormControl<FilterInputValue>;
  operator: FormControl<number | null>;
};

/**
 * Every possible type for a filter input value
 */
export type FilterInputValue = string | number | Date | boolean | null;