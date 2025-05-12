import { Component, Input, forwardRef, inject } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FilterType, FiltersEnums, FiltersOptionsEnums } from "@app/types/filters";
import { DataFilterService } from "@app/types/services/data-filter.service";
import { FilterInputValue } from "./types";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from "@angular-material-components/datetime-picker";
import { AutoCompleteComponent } from "@components/auto-complete.component";
import { NgxMatDatepickerInputEvent } from "@angular-material-components/datetime-picker/lib/datepicker-input-base";

@Component({
  selector: 'app-filters-dialog-input',
  templateUrl: './filters-dialog-input.component.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    AutoCompleteComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FiltersDialogInputComponent),
      multi: true,
    },
  ],
})
export class FiltersDialogInputComponent<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> implements ControlValueAccessor {
  @Input({ required: true }) type: FilterType;
  @Input({ required: false }) statuses: string[];

  readonly dataFiltersService = inject(DataFilterService);

  value: FilterInputValue = null;
  disabled = false;

  actualDate = new Date();
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

  onDateChange(event: NgxMatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.writeValue(`${event.value.getTime() / 1000}`);
    } else {
      this.writeValue(null);
    }
  }

  onDurationChange(event: Event, index: number) {
    this.duration[index] = (event.target as HTMLInputElement).value;
    const getHours = !isNaN(Number(this.duration[0])) ? Number(this.duration[0]) : this.getDurationInputValue('hours');
    const getMinutes = !isNaN(Number(this.duration[1])) ? Number(this.duration[1]) : this.getDurationInputValue('minutes');
    const getSeconds = !isNaN(Number(this.duration[2])) ? Number(this.duration[2]) : this.getDurationInputValue('seconds');

    const durationSeconds = (getHours ?? 0) * 3600
      + (getMinutes ?? 0) * 60 
      + (getSeconds ?? 0);

    this.writeValue(durationSeconds.toString());
  }

  getDurationInputValue(searchItem: string): number | undefined {
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
    this.value = value;

    if (this.registeredOnChange) {
      this.registeredOnChange(value);
    }

    if (this.registeredOnTouched) {
      this.registeredOnTouched(value);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
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