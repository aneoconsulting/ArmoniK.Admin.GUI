import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EditNameLineData, EditNameLineResult } from '@app/types/dialog';
import { FormNameLineComponent } from './form-name-line.component';

@Component({
  selector: 'app-edit-name-line-dialog',
  template: `
<h2 mat-dialog-title i18n="Dialog title">Edit the name line</h2>

<app-form-name-line
  [line]="name"
  (cancelChange)="onNoClick()"
  (submitChange)="onSubmit($event)"
></app-form-name-line>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
  ],
  imports: [
    FormNameLineComponent,
    MatDialogModule,
  ]
})
export class EditNameLineDialogComponent implements OnInit  {
  name: string;

  constructor(
    public _dialogRef: MatDialogRef<EditNameLineDialogComponent, EditNameLineResult>,
    @Inject(MAT_DIALOG_DATA) public data: EditNameLineData,
  ) {}

  ngOnInit(): void {
    this.name = this.data.name;
  }

  onSubmit(result: {name: string, type: string}) {
    this._dialogRef.close(result);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
