import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddLineDialogData, AddLineDialogResult } from '@app/types/dialog';
import { FormNameLineComponent } from './form-name-line.component';

@Component({
  selector: 'app-add-line-dialog',
  template: `
<h2 mat-dialog-title i18n="Dialog title">Add a line</h2>

<app-form-name-line
  (cancelChange)="onNoClick()"
  (submitChange)="onSubmit($event)"
></app-form-name-line>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [],
  imports: [
    MatDialogModule,
    FormNameLineComponent
  ]
})
export class AddLineDialogComponent {
  constructor(
    public _dialogRef: MatDialogRef<AddLineDialogComponent, AddLineDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: AddLineDialogData,
  ) {}

  onSubmit(result: AddLineDialogResult) {
    this._dialogRef.close(result);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
