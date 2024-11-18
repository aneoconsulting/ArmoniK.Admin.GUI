import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';

export interface TableInspectMessageDialogData {
  label: string;
  message: string;
}

@Component({
  selector: 'app-inspect-message-dialog',
  templateUrl: 'table-inspect-message-dialog.component.html',
  styleUrl: 'table-inspect-message-dialog.component.css',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
  ],
  providers: [
    NotificationService,
  ]
})
export class TableInspectMessageDialogComponent {
  get label() {
    return this.data.label;
  }

  get message() {
    return this.data.message;
  }

  constructor(
    public dialogRef: MatDialogRef<TableInspectMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: TableInspectMessageDialogData
  ) {}

  private readonly iconsService = inject(IconsService);
  private readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

  copy() {
    this.clipboard.copy(this.message);
    this.notificationService.success('Message copied');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }
}