import { NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AddLineDialogComponent } from '@app/dashboard/components/add-line-dialog.component';
import { AddLineDialogData, AddLineDialogResult } from '@app/types/dialog';

@Component({
  selector: 'app-add-dashboard-line',
  standalone: true,
  template: `
<form [formGroup]="lineForm" (ngSubmit)="onSubmit()">
  <mat-dialog-content>
    <mat-form-field appearance="outline">
      <mat-label for="name" i18n="Name of the statuses group"> Name </mat-label>
      <input matInput id="name" type="text" formControlName="name" i18n-placeholder="Placeholder" placeholder="Name of your line" required i18n="Input error">
      <mat-error *ngIf="lineForm.get('name')?.hasError('required')">
      Name is <strong>required</strong>
      </mat-error>
    </mat-form-field>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="onCancel()" type="button" i18n="Dialog action"> Cancel </button>
    <button mat-flat-button type="submit" color="primary" [disabled]="!lineForm.valid" i18n="Dialog action"> Confirm </button>
  </mat-dialog-actions>
</form>
  `,
  imports: [
    NgIf,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class AddDashboardLineComponent {

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<AddLineDialogResult>();
  
  lineForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ])
  });

  constructor(
    public _dialogRef: MatDialogRef<AddLineDialogComponent, AddLineDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: AddLineDialogData,
  ) {}

  onSubmit() {
    const result = {
      name: this.lineForm.value.name ?? ''
    } as AddLineDialogResult;
    this._dialogRef.close(result);
  }

  onCancel() {
    this._dialogRef.close();
  }
}