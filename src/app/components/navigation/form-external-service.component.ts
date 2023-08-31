import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ExternalService } from '@app/types/external-service';

@Component({
  selector: 'app-form-external-service',
  template: `
<form [formGroup]="serviceForm" (ngSubmit)="onSubmit()">
  <mat-dialog-content>
    <mat-form-field appearance="outline">
      <mat-label for="name" i18n="Name of the external service"> Name </mat-label>
      <input matInput id="name" type="text" formControlName="name" i18n-placeholder="Placeholder" placeholder="Name of the service" required>
       <mat-error *ngIf="serviceForm.get('name')?.hasError('required')" i18n="Input error">
      Name is <strong>required</strong>
      </mat-error>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label for="url" i18n="URL of the external service"> URL </mat-label>
      <input matInput id="url" type="url" formControlName="url" i18n-placeholder="Placeholder" placeholder="URL of the service" required>
       <mat-error *ngIf="serviceForm.get('url')?.hasError('required')" i18n="Input error">
      URL is <strong>required</strong>
      </mat-error>
    </mat-form-field>

    <mat-form-field subscriptSizing="dynamic" appearance="outline">
      <mat-label for="icon" i18n="Icon of the external service"> Icon </mat-label>
      <input matInput id="icon" type="text" formControlName="icon"i18n-placeholder="Placeholder" placeholder="Icon of the service">
      <!-- TODO: add a helper to tell to user how to choose the icon -->
    </mat-form-field>

    <div class="preview">
      <span i18n> Icon preview: </span>
      <mat-icon *ngIf="serviceForm.get('icon')?.value" aria-hidden="true" [fontIcon]="serviceForm.get('icon')?.value!"> </mat-icon>
    </div>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="onCancel()" type="button" i18n="Dialog action"> Cancel </button>
    <button mat-flat-button type="submit" color="primary" [disabled]="!serviceForm.valid" i18n="Dialog action"> Confirm </button>
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
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class FormExternalServiceComponent implements OnInit {
  @Input() externalService: ExternalService | null = null;

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<ExternalService>();

  serviceForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    url: new FormControl('', [
      Validators.required,
    ]),
    icon: new FormControl(''),
  });

  ngOnInit(): void {
    if (this.externalService) {
      this.serviceForm.patchValue(this.externalService);
    }
  }

  onSubmit() {
    this.submitChange.emit(this.serviceForm.value as ExternalService);
  }

  onCancel() {
    this.cancelChange.emit();
  }
}
