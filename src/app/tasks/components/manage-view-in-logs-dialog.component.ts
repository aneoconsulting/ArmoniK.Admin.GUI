import { NgIf } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ManageViewInLogsDialogData, ManageViewInLogsDialogResult } from '@app/types/dialog';

@Component({
  selector: 'app-tasks-manage-view-in-logs-dialog',
  templateUrl: './manage-view-in-logs-dialog.component.html',
  styles: [`
mat-dialog-content {
  padding-top: 0!important;
  overflow: visible!important;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.preview {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
}
  `],
  standalone: true,
  providers: [],
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class ManageViewInLogsDialogComponent implements OnInit {
  readonly #dialogRef = inject(MatDialogRef<ManageViewInLogsDialogComponent, ManageViewInLogsDialogResult>);

  viewInLogsForm = new FormGroup({
    serviceIcon: new FormControl('', Validators.required),
    serviceName: new FormControl('', Validators.required),
    urlTemplate: new FormControl('', Validators.required),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ManageViewInLogsDialogData,
  ) {}

  ngOnInit(): void {
    this.viewInLogsForm.patchValue(this.data);
  }

  onSubmit() {
    this.#dialogRef.close(this.viewInLogsForm.value);
  }

  onNoClick(): void {
    this.#dialogRef.close();
  }
}
