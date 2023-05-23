import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AddExternalServiceDialogData, ExternalService } from '@app/types/external-service';
import { FormExternalServiceComponent } from './form-external-service.component';

@Component({
  selector: 'app-add-external-service',
  template: `
<h2 mat-dialog-title>Add an external service</h2>

<app-form-external-service (cancelChange)="onNoClick()" (submitChange)="onSubmit($event)"></app-form-external-service>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [],
  imports: [
    FormExternalServiceComponent,
    MatDialogModule,
  ],
})
export class AddExternalServiceDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddExternalServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddExternalServiceDialogData
  ) {}

  onSubmit(result: ExternalService) {
    this.dialogRef.close(result);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
