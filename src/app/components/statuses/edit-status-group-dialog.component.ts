import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormStatusesGroupComponent } from './form-statuses-group.component';
import { EditStatusGroupDialogData, StatusLabeled, TasksStatusesGroup } from '../../dashboard/types';

@Component({
  selector: 'app-edit-statuses-group-dialog',
  template: `
<h2 mat-dialog-title i18n="Dialog title">Edit a Group</h2>

<app-form-statuses-group
  [group]="group"
  [statuses]="statuses"
  (cancelChange)="onNoClick()"
  (submitChange)="onSubmit($event)"
/>
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
  group: TasksStatusesGroup;
  statuses: StatusLabeled[] = [];

  constructor(
    public _dialogRef: MatDialogRef<EditStatusesGroupDialogComponent, TasksStatusesGroup>,
    @Inject(MAT_DIALOG_DATA) public data: EditStatusGroupDialogData,
  ) {}

  ngOnInit(): void {
    this.group = {...this.data.group};
    this.statuses = this.data.statuses;
  }

  onSubmit(result: TasksStatusesGroup) {
    this._dialogRef.close(result);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
