import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
// eslint-disable-next-line import/no-unresolved
import { NgxMatDatepickerInputEvent } from '@angular-material-components/datetime-picker/lib/datepicker-input-base';
import { Observable, Subject, delay, map, merge, startWith } from 'rxjs';
import { FilterInput, FilterInputOutput, FilterInputStatus, FilterInputType, FilterValueOptions } from '@app/types/filters';



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
    <mat-option *ngFor="let option of (filteredStatuses | async)" [value]="option.value">{{ option.value }}</mat-option>
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
export class FiltersDialogInputComponent implements OnInit {
  @Input({ required: true }) input: FilterInput;
  @Input() inputStatus: Subject<void>;

  // Maybe we will need to emit the type of value in order to be able to correctly handle the value.
  // Créer des types en fonction du type de champ
  @Output() valueChange: EventEmitter<FilterInputOutput> = new EventEmitter<FilterInputOutput>();
  actualDate = new Date();

  statusFormControl = new FormControl<string>('');
  statuses: FilterValueOptions;
  filteredStatuses: Observable<FilterValueOptions>;
  dataLoaded = new Subject<void>();

  ngOnInit(): void {
    this.statuses = (this.input as FilterInputStatus).statuses ?? [];
    
    if(this.statuses.length !== 0) {
      const key = ((this.input as FilterInputStatus).value as unknown as number);
      const actualStatus: string | undefined = key ? this.statuses[key].value : undefined;
      this.statusFormControl.setValue(actualStatus ? actualStatus : '');
    }
    
    this.inputStatus.pipe(delay(500)).subscribe(() => {
      this.statuses = (this.input as FilterInputStatus).statuses;
      this.dataLoaded.next();
    });

    this.filteredStatuses = merge(this.statusFormControl.valueChanges, this.dataLoaded).pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private _filter(value: string): FilterValueOptions {
    const filterValue = value.toLowerCase();

    return this.statuses.filter(status => status.value.toLowerCase().includes(filterValue));
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

  onStatusChange(): void {
    const formValue = this.statusFormControl.value?.toLowerCase();
    const key = this.statuses.find(status => status.value.toLowerCase() === formValue)?.key;
    
    if (key !== undefined) {
      this.valueChange.emit({
        type: 'string',
        value: key.toString(),
      });
    }
    
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
