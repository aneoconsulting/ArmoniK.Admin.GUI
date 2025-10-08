import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StatusColorPickerDialogData } from '@app/types/dialog';
import { Status, StatusLabelColor } from '@app/types/status';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-status-picker-dialog',
  templateUrl: 'status-color-picker.dialog.component.html',
  styleUrl: 'status-color-picker.dialog.component.scss',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTooltipModule,
  ],
  providers: [
    Clipboard,
    NotificationService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusColorPickerDialogComponent<S extends Status> {
  private readonly iconsService = inject(IconsService);
  private readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

  readonly statuses: S[];
  readonly statusesForm: FormRecord<FormControl<string>>;

  readonly statusesDefault: Record<S, StatusLabelColor>;

  constructor(
    private readonly dialogRef: MatDialogRef<StatusColorPickerDialogComponent<S>, Record<S, StatusLabelColor>>,
    @Inject(MAT_DIALOG_DATA) data: StatusColorPickerDialogData<S>
  ) {
    this.statuses = data.keys;
    this.statusesForm = new FormRecord(
      this.statuses.reduce((acc, status) => {
        acc[status] = new FormControl<string>(data.current[status].color, { nonNullable: true });
        return acc;
      },
      {} as Record<S, FormControl<string>>)
    );
    this.statusesDefault = data.default;
  }

  getControl(status: S): FormControl<string> | null {
    return this.statusesForm.get(`${status}`) as unknown as FormControl<string> | null;
  }

  copy(status: S) {
    const value = this.getControl(status)?.value;
    if (value) {
      this.clipboard.copy(value.replace('#', ''));
      this.notificationService.success($localize`Color copied !`);
    } else {
      this.notificationService.error($localize`An error occurred`);
    }
  }

  reset(status: S) {
    const control = this.getControl(status);
    if (control) {
      control.reset();
    }
  }

  resetDefault(status: S) {
    const control = this.getControl(status);
    const defaultColor = this.statusesDefault[status].color;
    if (control && defaultColor) {
      control.patchValue(defaultColor);
      control.markAsDirty();
    }
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    const record = this.statusesForm.getRawValue();
    const result = this.statuses.reduce((acc, status) => {
      acc[status] = {
        ...this.statusesDefault[status],
        color: record[status.toString()],
      };
      return acc;
    }, {} as Record<S, StatusLabelColor>);
    this.dialogRef.close(result);
  }
}