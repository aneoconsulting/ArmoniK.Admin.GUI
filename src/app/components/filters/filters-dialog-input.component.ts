import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
// eslint-disable-next-line import/no-unresolved
import { NgxMatDatepickerInputEvent } from '@angular-material-components/datetime-picker/lib/datepicker-input-base';
import { Observable, map, startWith } from 'rxjs';
import { FilterInput, FilterInputOutput, FilterInputType, MaybeNull } from '@app/types/filters';

@Component({
  selector: 'app-filters-dialog-input',
  templateUrl: './filters-dialog-input.component.html',
  styles: [`
mat-form-field {
  width: 100%;
}
`],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatFormFieldModule,
    MatInputModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    AsyncPipe,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class FiltersDialogInputComponent implements OnInit {
  @Input({ required: true }) input: FilterInput;
  @Input({ required: true }) statusFormControl: FormControl<string | null>;
  @Input({ required: true }) filteredStatuses: Observable<string[]>;

  booleanFormControl: FormControl<string | null>;
  filteredBooleans: Observable<string[]>;

  // Maybe we will need to emit the type of value in order to be able to correctly handle the value.
  // Créer des types en fonction du type de champ
  @Output() valueChange: EventEmitter<FilterInputOutput> = new EventEmitter<FilterInputOutput>();
  actualDate = new Date();
  duration: {[key: number]: string} = {};

  ngOnInit(): void {
    this.booleanFormControl = new FormControl<string | null>(this.input.value as unknown as string);
    this.filteredBooleans = this.booleanFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterBoolean(value))
    );
  }

  onStringChange(event: Event): void {
    this.valueChange.emit({
      type: 'string',
      value: (event.target as HTMLInputElement).value,
    });
  }

  onNumberChange(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (isNaN(value)) return;
    this.valueChange.emit({
      type: 'number',
      value: value,
    });
  }

  onDateChange(event: NgxMatDatepickerInputEvent<Date>): void {
    this.valueChange.emit({
      type: 'date',
      value: event.value?.getTime() ? (event.value?.getTime() / 1000) : null,
    });
  }

  onBooleanChange(): void {
    const value = this.booleanFormControl.value;
    this.valueChange.emit({
      type: 'boolean',
      value: value?.toLowerCase() === 'true',
    });
  }

  onStatusChange(): void {
    const formValue = this.statusFormControl.value;

    this.valueChange.emit({
      type: 'status',
      value: formValue,
    });
  }

  onDurationChange(event: Event, index: number) {
    this.duration[index] = (event.target as HTMLInputElement).value;
    const getHours = !isNaN(Number(this.duration[0])) ? Number(this.duration[0]) : this.getDurationInputValue('hours');
    const getMinutes = !isNaN(Number(this.duration[1])) ? Number(this.duration[1]) : this.getDurationInputValue('minutes');
    const getSeconds = !isNaN(Number(this.duration[2])) ? Number(this.duration[2]) : this.getDurationInputValue('seconds');

    const durationSeconds = (getHours ?? 0) * 3600
      + (getMinutes ?? 0) * 60 
      + (getSeconds ?? 0);

    this.valueChange.emit({
      type: 'duration',
      value: durationSeconds
    });
  }

  getInputType(): FilterInputType  {
    switch (this.input.type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'date':
      return 'date';
    case 'array':
      return 'string';
    case 'status':
      return 'status';
    default:
      return 'string';
    }
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

  private _filterBoolean(value: MaybeNull<string>): string[] {
    const booleans = ['true', 'false'];
    if (value === null) {
      return booleans;
    } else {
      return booleans.filter(bool => bool.toLowerCase().includes(value.toLowerCase()));
    }
  }

  trackBySelect(_: number, item: { value: string }): string {
    return item.value;
  }
}
