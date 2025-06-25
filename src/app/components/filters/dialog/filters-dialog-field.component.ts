import { Component, EventEmitter, Input, OnInit, Output, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CustomColumn } from '@app/types/data';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { FilterFieldValue, FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';
import { DataFilterService, FilterField } from '@app/types/services/data-filter.service';
import { AutoCompleteComponent } from '@components/auto-complete.component';
import { FormFilterType } from './types';

@Component({
  selector: 'app-filters-dialog-field',
  templateUrl: 'filters-dialog-field.component.html',
  standalone: true,
  imports: [
    AutoCompleteComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FitlersDialogFieldComponent),
      multi: true,
    },
  ],
})
export class FitlersDialogFieldComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> implements OnInit, ControlValueAccessor {
  value: string | null = null;
  
  labelledProperties: string[];

  @Input({ required: true }) filter: FormGroup<FormFilterType<F, O>>;
  @Input({ required: true }) customProperties: CustomColumn[];

  @Output() for = new EventEmitter<FilterFor<F, O>>();
  
  private readonly dataFiltersService = inject(DataFilterService);

  ngOnInit(): void {
    this.labelledProperties = this.dataFiltersService.filtersDefinitions.map(property => this.retrieveLabel(property));
    if (this.customProperties) {
      this.labelledProperties.push(...this.customProperties.map(custom => custom.replace('options.options.', '')));
    }
  }

  private retrieveLabel(filterDefinition: FilterDefinition<F, O>) {
    try {
      return this.dataFiltersService.retrieveLabel(filterDefinition.for, filterDefinition.field as FilterField);
    } catch {
      return '';
    }
  }

  writeValue(value: string): void {
    if (!isNaN(Number(value))) {
      value = this.retrieveLabel({ for: this.filter.value.for, field: Number(value) } as FilterDefinition<F, O>) ;
    }
    this.value = value;

    const field = this.dataFiltersService.retrieveField(value) as { for: FilterFor<F, O>; index: number };
    let change: FilterFieldValue<F, O> = null;
    if (field.index === -1) {
      const isCustom = this.customProperties.find(col => col.toLowerCase() === `options.options.${value.toLowerCase()}`);
      if (isCustom) {
        change = value;
        this.emitFor('custom');
      }
    } else {
      change = field.index as F | O;
      this.emitFor(field.for);
    }

    if (this.registeredOnChange) {
      this.registeredOnChange(change);
    }

    if (this.registeredOnTouched) {
      this.registeredOnTouched(change);
    }
  }

  private emitFor(value: FilterFor<F, O>) {
    this.for.emit(value);
  }

  private registeredOnChange: (val: FilterFieldValue<F, O>) => void;
  
  private registeredOnTouched: (val: FilterFieldValue<F, O>) => void;
  
  registerOnChange(fn: (val: FilterFieldValue<F, O>) => void): void {
    this.registeredOnChange = fn;
  }
  
  registerOnTouched(fn: (val: FilterFieldValue<F, O>) => void): void {
    this.registeredOnTouched = fn;
  }
}