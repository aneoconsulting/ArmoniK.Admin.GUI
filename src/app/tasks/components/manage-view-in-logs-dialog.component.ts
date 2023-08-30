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
  template: `
<h2 mat-dialog-title i18n="Dialog title"> Manage View in Logs </h2>

<form [formGroup]="viewInLogsForm" (ngSubmit)="onSubmit()">
  <!-- TODO: ajouter les consignes %taskId pour l'usage -->
  <mat-dialog-content>
    <mat-form-field appearance="outline">
      <mat-label for="serviceName" i18n> Service Name </mat-label>
      <input matInput id="serviceName" type="text" formControlName="serviceName" i18n-placeholder="Placeholder" placeholder="Name of the service" required>
       <mat-error *ngIf="viewInLogsForm.get('serviceName')?.hasError('required')" i18n="Input error">
      Name is <strong>required</strong>
      </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label for="urlTemplate" i18n="URL Template"> URL Template </mat-label>
      <input matInput id="urlTemplate" type="url" formControlName="urlTemplate" i18n-placeholder="Placeholder" placeholder="URL of the service" required>
       <mat-error *ngIf="viewInLogsForm.get('urlTemplate')?.hasError('required')" i18n="Input error">
      URL is <strong>required</strong>
      </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label for="serviceIcon" i18n> Service Icon </mat-label>
      <input matInput id="serviceIcon" type="text" formControlName="serviceIcon" i18n-placeholder="Placeholder" placeholder="Icon of the service" required>
       <mat-error *ngIf="viewInLogsForm.get('serviceIcon')?.hasError('required')" i18n="Input error">
      Icon is <strong>required</strong>
      </mat-error>
      <!-- TODO: add a helper to tell to user how to choose the icon -->
    </mat-form-field>

    <div class="preview">
      <span i18n> Icon preview: </span>
      <mat-icon *ngIf="viewInLogsForm.get('serviceIcon')?.value" aria-hidden="true" [fontIcon]="viewInLogsForm.get('serviceIcon')?.value!"> </mat-icon>
    </div>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="onNoClick()" type="button" i18n="Dialog action"> Cancel </button>
    <button mat-flat-button type="submit" color="primary" [disabled]="!viewInLogsForm.valid" i18n="Dialog action"> Confirm </button>
  </mat-dialog-actions>
</form>
  `,
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
