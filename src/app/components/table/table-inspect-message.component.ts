import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TableInspectMessageDialogComponent, TableInspectMessageDialogData } from './table-inspect-message-dialog.component';

@Component({
  selector: 'app-table-inspect-message',
  templateUrl: 'table-inspect-message.component.html',
  styleUrl: 'table-inspect-message.component.css',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    EmptyCellPipe,
  ],
  providers: [
    NotificationService
  ]
})
export class TableInspectMessageComponent {
  @Input({ required: true }) label: string;
  
  @Input({ required: true }) set message(entry: string | undefined) {

    if (entry && entry !== '') {
      if (entry.length > 15) {
        this._croppedMessage = `${entry.substring(0, 14).trimEnd()}...`;
        this._message = entry;
        this._displayEye = true;
      } else {
        this._croppedMessage = entry;
      }
    }
  }

  private readonly iconsService = inject(IconsService);
  private readonly dialog = inject(MatDialog);
  private readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

  private _croppedMessage: string | undefined;
  private _message: string |undefined;
  private _displayEye = false;

  get message() {
    return this._message;
  }

  get croppedMessage() {
    return this._croppedMessage;
  }

  get displayEye() {
    return this._displayEye;
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  onView() {
    if (this._message) {
      this.dialog.open<TableInspectMessageDialogComponent, TableInspectMessageDialogData>(TableInspectMessageDialogComponent, {
        data: {
          label: this.label,
          message: this._message
        }
      });
    }
  }

  copy() {
    if (this._message) {
      this.clipboard.copy(this._message);
      this.notificationService.success('Message copied');
    }
  }
}