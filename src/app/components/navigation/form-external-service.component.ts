import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ExternalService } from '@app/types/external-service';
import { IconPickerDialogComponent } from '@components/icon-picker-dialog.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-form-external-service',
  templateUrl: './form-external-service.component.html',
  styles: [`
mat-dialog-content {
  padding-top: 0!important;
  overflow: visible!important;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.grid-span-2 {
  grid-column: span 2;
}

.icon {
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.preview {
  margin-top: 1rem;
  display: flex;
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
    IconPickerDialogComponent
  ],
})
export class FormExternalServiceComponent implements OnInit {
  @Input() externalService: ExternalService | null = null;

  @Output() cancelChange = new EventEmitter<void>();
  @Output() submitChange = new EventEmitter<ExternalService>();

  icon: string = '';

  serviceForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
    ]),
    url: new FormControl('', [
      Validators.required,
    ]),
  });

  ngOnInit(): void {
    if (this.externalService) {
      this.serviceForm.patchValue(this.externalService);
      this.icon = this.externalService.icon || '';
    }
  }

  onSubmit() {
    this.submitChange.emit({
      ...this.serviceForm.value as ExternalService,
      icon: this.icon
    });
  }

  onCancel() {
    this.cancelChange.emit();
  }
}
