import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
// eslint-disable-next-line import/no-unresolved
import { NgxMatDatepickerInputEvent } from '@angular-material-components/datetime-picker/lib/datepicker-input-base';
import { Observable } from 'rxjs';
import { FilterInput, FilterInputOutput, FilterInputType } from '@app/types/filters';



@Component({
  selector: 'app-filters-dialog-input',
  template: `
<mat-form-field appearance="outline" subscriptSizing="dynamic" *ngIf="input.type === 'string'">
  <mat-label i18n="Input label">Value</mat-label>
  <input matInput [type]="getInputType()" placeholder="Value" [value]="input.value" (change)="onStringChange($event)">
</mat-form-field>

<mat-form-field appearance="outline" subscriptSizing="dynamic" *ngIf="input.type === 'number'">
  <mat-label i18n="Input label">Value</mat-label>
  <input matInput type="number" placeholder="Value" [value]="input.value" (change)="onNumberChange($event)">
</mat-form-field>

<mat-form-field class="dateForm" appearance="outline" subscriptSizing="dynamic" *ngIf="input.type === 'date'">
  <mat-label i18n="Input label">Choose a date</mat-label>
  <input matInput [ngxMatDatetimePicker]="picker" (dateChange)="onDateChange($event)" [value]="input.value" placeholder="Choose a date">
   <ngx-mat-datepicker-toggle matSuffix [for]="picker"></ngx-mat-datepicker-toggle>
   <ngx-mat-datetime-picker #picker [startAt]="actualDate" [showSpinners]="true" [showSeconds]="true" >
    <ngx-mat-datepicker-actions>
      <button mat-flat-button color="accent" ngxMatDatepickerApply>
      <span i18n>Apply</span>
      </button>
    </ngx-mat-datepicker-actions>
  </ngx-mat-datetime-picker>
</mat-form-field>

<mat-form-field appearance="outline" subscriptSizing="dynamic" *ngIf="input.type === 'status'">
  <mat-label i18n="Input label">Value</mat-label>
  <input matInput [matAutocomplete]="autoStatus" [formControl]="statusFormControl" (input)="onStatusChange()">
  <mat-autocomplete (optionSelected)="onStatusChange()" #autoStatus>
    <mat-option *ngFor="let option of (filteredStatuses | async)" [value]="option">{{ option }}</mat-option>
  </mat-autocomplete>
</mat-form-field>
  `,
  styles: [`
mat-form-field {
  width: 100%;
};
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
    ReactiveFormsModule
  ],
})
export class FiltersDialogInputComponent {
  @Input({ required: true }) input: FilterInput;
  @Input({ required: true }) statusFormControl: FormControl<string | null>;
  @Input({ required: true }) filteredStatuses: Observable<string[]>;

  // Maybe we will need to emit the type of value in order to be able to correctly handle the value.
  // Créer des types en fonction du type de champ
  @Output() valueChange: EventEmitter<FilterInputOutput> = new EventEmitter<FilterInputOutput>();
  actualDate = new Date();

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

  onStatusChange(): void {
    const formValue = this.statusFormControl.value?.toLowerCase();

    this.valueChange.emit({
      type: 'status',
      value: formValue ? formValue : null,
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

  trackBySelect(_: number, item: { value: string }): string {
    return item.value;
  }
}
