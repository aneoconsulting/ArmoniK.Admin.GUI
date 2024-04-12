import { NgIf } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ManageViewInLogsDialogData, ManageViewInLogsDialogResult } from '@app/types/dialog';
import { IconPickerDialogComponent } from '@components/icon-picker-dialog.component';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-tasks-manage-view-in-logs-dialog',
  templateUrl: './manage-view-in-logs-dialog.component.html',
  styles: [`
mat-dialog-content {
  padding-top: 0!important;
  overflow: visible!important;
  display: flex;
  flex-direction: column;
}

.service-decoration {
  display: flex;
  align-items: start;
  gap: 1rem;
}

.url-service {
  width: 100%;
}

.preview {
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.manage-presentation {
  max-width: 425px;
}
  `],
  standalone: true,
  providers: [
    IconsService,
  ],
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    IconPickerDialogComponent,
  ],
})
export class ManageViewInLogsDialogComponent implements OnInit {
  readonly #dialogRef = inject(MatDialogRef<ManageViewInLogsDialogComponent, ManageViewInLogsDialogResult>);
  readonly iconsService = inject(IconsService);
  icon: string;

  viewInLogsForm = new FormGroup({
    serviceIcon: new FormControl('', Validators.required),
    serviceName: new FormControl('', Validators.required),
    urlTemplate: new FormControl('', Validators.required),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ManageViewInLogsDialogData) {}

  ngOnInit(): void {
    this.viewInLogsForm.patchValue(this.data);
    this.icon = this.data.serviceIcon ?? 'icon';
  }

  onIconChange(icon: string) {
    this.viewInLogsForm.controls.serviceIcon.setValue(icon);
    this.icon = icon;
  }

  onSubmit() {
    this.#dialogRef.close(this.viewInLogsForm.value);
  }

  onNoClick(): void {
    this.#dialogRef.close();
  }

  getIcon(icon: string): string {
    return this.iconsService.getIcon(icon);
  }
}
