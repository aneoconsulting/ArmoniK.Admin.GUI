import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EditExternalServiceDialogData, ExternalService } from '@app/types/external-service';
import { FormExternalServiceComponent } from './form-external-service.component';

@Component({
  selector: 'app-edit-external-service',
  template: `
<h2 mat-dialog-title>Edit an external service</h2>

<app-form-external-service [externalService]="externalService" (cancelChange)="onNoClick()" (submitChange)="onSubmit($event)"></app-form-external-service>
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
export class EditExternalServiceDialogComponent implements OnInit {
  externalService: ExternalService;

  constructor(
    public dialogRef: MatDialogRef<EditExternalServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditExternalServiceDialogData
  ) {}

  ngOnInit(): void {
    this.externalService = Object.assign({}, this.data.externalService);
  }

  onSubmit(result: ExternalService) {
    this.dialogRef.close(result);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
