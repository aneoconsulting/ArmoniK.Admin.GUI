import { Component, Input, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterType } from '@app/types/filters';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { AutoCompleteComponent } from '@components/auto-complete.component';
import { NgxMatDatepickerActions, NgxMatDatepickerApply, NgxMatDatepickerCancel, NgxMatDatepickerInput, NgxMatDatepickerInputEvent, NgxMatDatepickerToggle, NgxMatDatetimepicker } from '@ngxmc/datetime-picker';
import { Moment } from 'moment';
import { FilterInputValue } from './types';

@Component({
  selector: 'app-filters-dialog-input',
  templateUrl: 'filters-dialog-input.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    AutoCompleteComponent,
    ReactiveFormsModule,
    NgxMatDatepickerActions,
    NgxMatDatepickerApply,
    NgxMatDatepickerCancel,
    NgxMatDatepickerInput,
    NgxMatDatetimepicker,
    NgxMatDatepickerToggle,
    MatButtonModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FiltersDialogInputComponent),
      multi: true,
    },
  ],
})
export class FiltersDialogInputComponent implements ControlValueAccessor {
  @Input({ required: true }) type: FilterType;
  @Input({ required: false }) statuses: string[];

  readonly dataFiltersService = inject(DataFilterService);

  value: FilterInputValue = null;
  dateForm = new FormControl<Date | null>(null);

  duration: {[key: number]: string} = {};

  get valueAsString() {
    return this.value as string;
  }

  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value as FilterInputValue;

    this.writeValue(value);
  }

  onAutoCompleteChange(event: string) {
    this.writeValue(event);
  }

  onBooleanChange(value: string): void {
    this.writeValue(`${value?.toLowerCase() === 'true'}`);
  }

  onDateChange(event: NgxMatDatepickerInputEvent<Moment>): void {
    if (event.value) {
      this.writeValue(`${event.value.toDate().getTime() / 1000}`);
    } else {
      this.writeValue(null);
    }
  }

  onDurationChange(event: Event, index: number) {
    this.duration[index] = (event.target as HTMLInputElement).value;

    const hours = this.getValidNumber(this.duration[0]) ?? this.getDurationInputValue('hours') ?? 0;
    const minutes = this.getValidNumber(this.duration[1]) ?? this.getDurationInputValue('minutes') ?? 0;
    const seconds = this.getValidNumber(this.duration[2]) ?? this.getDurationInputValue('seconds') ?? 0;

    const durationSeconds = hours * 3600 + minutes * 60 + seconds;
    this.writeValue(durationSeconds.toString());
  }

  
  private getValidNumber(value: string): number | null {
    const num = Number(value);
    return !isNaN(num) ? num : null;
  }

  getDurationInputValue(searchItem: 'hours' | 'minutes' | 'seconds'): number | undefined {
    switch (searchItem) {
    case 'hours':
      return !isNaN(Number(this.value)) ? Math.floor(Number(this.value)/3600) : undefined;
    case 'minutes':
      return !isNaN(Number(this.value)) ? Math.floor((Number(this.value)%3600)/60) : undefined;
    case 'seconds':
      return !isNaN(Number(this.value)) ? Math.floor(((Number(this.value))%3600)%60) : undefined;
    default:
      return undefined;
    }
  }

  writeValue(value: FilterInputValue): void {
    if (this.type === 'date' && !isNaN(Number(value))) {
      this.dateForm.setValue(new Date(Number(value) * 1000));
    }
    this.value = value;

    if (this.registeredOnChange) {
      this.registeredOnChange(value);
    }

    if (this.registeredOnTouched) {
      this.registeredOnTouched(value);
    }
  }

  private registeredOnChange?: (val: FilterInputValue) => void;

  private registeredOnTouched?: (val: FilterInputValue) => void;

  registerOnChange(fn: (val: FilterInputValue) => void): void {
    this.registeredOnChange = fn;
  }

  registerOnTouched(fn: (val: FilterInputValue) => void): void {
    this.registeredOnTouched = fn;
  }
}