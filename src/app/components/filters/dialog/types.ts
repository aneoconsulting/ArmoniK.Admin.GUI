import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FilterFor } from '@app/types/filter-definition';
import { FilterFieldValue, FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';


export type FormFiltersOr<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> = FormArray<FormFiltersAnd<F, O>>;

export type FormFiltersAnd<F extends FiltersEnums, O extends FiltersOptionsEnums | null> = FormArray<FormFilter<F, O>>;

export type FormFilter<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> = FormGroup<FormFilterType<F, O>>;

export type FormFilterType<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> = {
  for: FormControl<FilterFor<F, O> | null>;
  field: FormControl<FilterFieldValue<F, O>>;
  value: FormControl<FilterInputValue>;
  operator: FormControl<number | null>;
};

export type FilterInputValue = string | number | Date | boolean | null;