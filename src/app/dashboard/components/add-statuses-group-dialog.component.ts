import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormStatusesGroupComponent } from './form-statuses-group.component';
import { AddStatusGroupDialogData, StatusLabeled, TasksStatusesGroup } from '../types';

@Component({
  selector: 'app-add-statuses-group-dialog',
  template: `
<h2 mat-dialog-title>Add a group</h2>

<app-form-statuses-group
  [group]="null"
  [statuses]="statuses"
  (cancelChange)="onNoClick()"
  (submitChange)="onSubmit($event)"
></app-form-statuses-group>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [
  ],
  imports: [
    FormStatusesGroupComponent,
    MatDialogModule,
  ]
})
export class AddStatusesGroupDialogComponent implements OnInit {
  statuses: StatusLabeled[] = [];

  constructor(
    public _dialogRef: MatDialogRef<AddStatusesGroupDialogComponent, TasksStatusesGroup>,
    @Inject(MAT_DIALOG_DATA) public data: AddStatusGroupDialogData,
  ) {}

  ngOnInit(): void {
    this.statuses = this.data.statuses;
  }

  onSubmit(result: TasksStatusesGroup) {
    this._dialogRef.close(result);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
