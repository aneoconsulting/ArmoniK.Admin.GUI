import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormControl, FormRecord, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Status, StatusLabelColor } from '@app/types/status';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-status-picker-dialog',
  templateUrl: 'status-color-picker.dialog.component.html',
  styleUrl: 'status-color-picker.dialog.component.css',
  standalone: true,
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
  readonly statusesRecord: Record<S, StatusLabelColor>;
  readonly statusesForm: FormRecord<FormControl<string>>;

  constructor(
    private readonly dialogRef: MatDialogRef<StatusColorPickerDialogComponent<S>, Record<S, StatusLabelColor>>,
    @Inject(MAT_DIALOG_DATA) data: Record<S, StatusLabelColor>
  ) {
    this.statuses = Object.keys(data).map((value: string) => Number(value) as S);
    this.statusesForm = new FormRecord(
      this.statuses.reduce((acc, status) => {
        acc[status] = new FormControl<string>(data[status].color, { nonNullable: true });
        return acc;
      },
      {} as Record<S, FormControl<string>>)
    );
    this.statusesRecord = {...data};
  }

  getValue(status: S): string | null {
    return this.statusesForm.get(`${status}`)?.value as string || null;
  }

  copy(status: S) {
    const value = this.getValue(status);
    if (value) {
      this.clipboard.copy(value.replace('#', ''));
      this.notificationService.success($localize`Color copied !`);
    } else {
      this.notificationService.error($localize`An error occured`);
    }
  }

  reset(status: S) {
    const control = this.statusesForm.get(`${status}`);
    if (control) {
      control.reset();
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
    const result = Object.keys(record).map((status) => Number(status) as S).reduce((acc, status) => {
      acc[status] = {
        ...this.statusesRecord[status],
        color: record[status.toString()],
      };
      return acc;
    }, {} as Record<S, StatusLabelColor>);
    this.dialogRef.close(result);
  }
}