import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
// eslint-disable-next-line import/no-unresolved
import { NgxMatDatepickerInputEvent } from '@angular-material-components/datetime-picker/lib/datepicker-input-base';
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
  <mat-select [value]="input.value?.toString()" (valueChange)="onStatusChange($event)">
    <mat-option *ngFor="let option of input.statuses; trackBy: trackBySelect" [value]="option.key">{{ option.value }}</mat-option>
  </mat-select>
</mat-form-field>

<mat-form-field style="" id="durationForm" appearance="outline" subscriptSizing="dynamic" *ngIf="input.type === 'duration'">
  <input matInput style="width: 25%; margin-right: 5px;" type="number" min="0" [value]="getDurationInputValue('hours')" (change)="onDurationChange($event, 0)" placeholder="hh">:
  <input matInput style="width: 30%; margin-right: 5px;" type="number" min="0" [value]="getDurationInputValue('minutes')" (change)="onDurationChange($event, 1)" placeholder="mm">:
  <input matInput style="width: 25%;" type="number" min="0" [value]="getDurationInputValue('seconds')" (change)="onDurationChange($event, 2)" placeholder="ss">
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
    MatSelectModule,
    NgxMatTimepickerModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
  ],
})
export class FiltersDialogInputComponent {
  @Input({ required: true }) input: FilterInput;

  // Maybe we will need to emit the type of value in order to be able to correctly handle the value.
  // Créer des types en fonction du type de champ
  @Output() valueChange: EventEmitter<FilterInputOutput> = new EventEmitter<FilterInputOutput>();
  actualDate = new Date();
  duration: {[key: number]: string} = {};

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

  onStatusChange(event: string): void {
    this.valueChange.emit({
      type: 'string',
      value: event,
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

  trackBySelect(_: number, item: { value: string }): string {
    return item.value;
  }
}
