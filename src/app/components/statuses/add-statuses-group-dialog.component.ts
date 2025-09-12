import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormStatusesGroupComponent } from './form-statuses-group.component';
import { AddStatusGroupDialogData, TasksStatusesGroup } from '../../dashboard/types';

@Component({
  selector: 'app-add-statuses-group-dialog',
  templateUrl: 'add-statuses-group-dialog.component.html',
  styles: [`
  `],
  providers: [],
  imports: [
    FormStatusesGroupComponent,
    MatDialogModule,
  ]
})
export class AddStatusesGroupDialogComponent {
  constructor(
    public _dialogRef: MatDialogRef<AddStatusesGroupDialogComponent, TasksStatusesGroup>,
    @Inject(MAT_DIALOG_DATA) public data: AddStatusGroupDialogData,
  ) {}

  onSubmit(result: TasksStatusesGroup) {
    this._dialogRef.close(result);
  }

  onNoClick(): void {
    this._dialogRef.close();
  }
}
