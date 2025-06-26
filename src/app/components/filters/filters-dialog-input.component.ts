import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FilterInput } from '@app/types/filters';
import { AutoCompleteComponent } from '@components/auto-complete.component';
import { NgxMatDatepickerActions, NgxMatDatepickerApply, NgxMatDatepickerCancel, NgxMatDatepickerInput, NgxMatDatepickerInputEvent, NgxMatDatepickerToggle, NgxMatDatetimepicker } from '@ngxmc/datetime-picker';

@Component({
  selector: 'app-filters-dialog-input',
  templateUrl: './filters-dialog-input.component.html',
  styleUrl: 'filters-dialog-input.component.css',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    AutoCompleteComponent,
    NgxMatDatepickerActions,
    NgxMatDatepickerApply,
    NgxMatDatepickerCancel,
    NgxMatDatepickerInput,
    NgxMatDatetimepicker,
    NgxMatDatepickerToggle,
  ],
})
export class FiltersDialogInputComponent {
  @Input({ required: true }) input: FilterInput;
  @Input({ required: true }) statuses: string[];
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  booleans = ['true', 'false'];
  duration: {[key: number]: string} = {};

  private emit(value: string) {
    this.valueChange.emit(value);
  }

  onChange(event: Event): void {
    this.emit((event.target as HTMLInputElement).value);
  }

  onDateChange(event: NgxMatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.emit(`${event.value.getTime() / 1000}`);
    } else {
      this.emit('');
    }
  }

  onBooleanChange(value: string): void {
    this.emit(`${value?.toLowerCase() === 'true'}`);
  }

  onStatusChange(value: string) {
    this.emit(value);
  }

  onDurationChange(event: Event, index: number) {
    this.duration[index] = (event.target as HTMLInputElement).value;
    const getHours = !isNaN(Number(this.duration[0])) ? Number(this.duration[0]) : this.getDurationInputValue('hours');
    const getMinutes = !isNaN(Number(this.duration[1])) ? Number(this.duration[1]) : this.getDurationInputValue('minutes');
    const getSeconds = !isNaN(Number(this.duration[2])) ? Number(this.duration[2]) : this.getDurationInputValue('seconds');

    const durationSeconds = (getHours ?? 0) * 3600
      + (getMinutes ?? 0) * 60 
      + (getSeconds ?? 0);

    this.emit(durationSeconds.toString());
  }

  getDurationInputValue(searchItem: string): number | undefined {
    switch (searchItem) {
    case 'hours':
      return !isNaN(Number(this.input.value)) ? Math.floor(Number(this.input.value)/3600) : undefined;
    case 'minutes':
      return !isNaN(Number(this.input.value)) ? Math.floor((Number(this.input.value)%3600)/60) : undefined;
    case 'seconds':
      return !isNaN(Number(this.input.value)) ? Math.floor(((Number(this.input.value))%3600)%60) : undefined;
    default:
      return undefined;
    }
  }
}
