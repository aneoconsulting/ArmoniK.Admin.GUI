import { NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { AutoRefreshDialogData } from '@app/types/dialog';

@Component({
  selector: 'app-auto-refresh-dialog',
  template: `
    <h2 mat-dialog-title i18n="Dialog title">Set up Auto Refresh</h2>

    <mat-dialog-content>
      <p i18n="Dialog description">
        Enter the number of seconds between each refresh. Use 0 to disable.
      </p>

      <mat-form-field class="example-full-width" appearance="outline">
        <mat-label i18n="Label Input">Interval</mat-label>
        <input type="number"
        i18n-placeholder="Placeholder Input"
        placeholder="Seconds"
        aria-label="Number"
        matInput
        [value]="value"
        [matAutocomplete]="auto"
        (change)="onNumberChange($event)"
        >

        <mat-autocomplete autoActiveFirstOption  #auto="matAutocomplete" (optionSelected)="onOptionSelected($event)">
          <mat-option *ngFor="let option of options" [value]="option">
            {{ option }}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()" i18n="Dialog action"> Cancel </button>
      <button mat-flat-button [mat-dialog-close]="value" color="primary" i18n="Dialog action"> Confirm </button>
    </mat-dialog-actions>
  `,
  styles: [''],
  standalone: true,
  imports: [
    NgFor,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatInputModule
  ]
})
export class AutoRefreshDialogComponent implements OnInit {
  options = [0, 1, 5, 10, 30, 60, 300, 600, 1800, 3600];

  value = 0;

  constructor(public dialogRef: MatDialogRef<AutoRefreshDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: AutoRefreshDialogData){}

  ngOnInit(): void {
    this.value = this.data.value;
  }

  onNumberChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this._setValue(target.value);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;

    this._setValue(value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private _setValue(value: number | string | null) {
    if (!value) {
      this.value = 0;
    }

    value = Number(value);

    if (Number.isNaN(value)) {
      this.value = 0;
    }
    else {
      this.value = value;
    }
  }
}
