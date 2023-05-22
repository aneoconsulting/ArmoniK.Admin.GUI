import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormStatusesGroupComponent } from './form-statuses-group.component';
import { EditStatusGroupDialogData, StatusLabeled, TasksStatusGroup } from '../types';

@Component({
  selector: 'app-edit-statuses-group-dialog',
  template: `
<h2 mat-dialog-title>Edit a Group</h2>

<app-form-statuses-group
  [group]="group"
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
export class EditStatusesGroupDialogComponent implements OnInit {
  group: TasksStatusGroup;
  statuses: StatusLabeled[] = [];

  constructor(
    public _dialogRef: MatDialogRef<EditStatusesGroupDialogComponent, TasksStatusGroup>,
    @Inject(MAT_DIALOG_DATA) public data: EditStatusGroupDialogData,
  ) {}

  ngOnInit(): void {
    this.group = Object.assign({}, this.data.group);
    this.statuses = this.data.statuses;
  }

  onSubmit(result: TasksStatusGroup) {
    this._dialogRef.close(result);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
