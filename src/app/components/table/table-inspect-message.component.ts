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

/**
 * Cell responsible to display a message associated to an ArmonikData.
 * Displays the message cropped (if it is longer than 15 characters), a copy button and an "eye" button that allows the user to see the full message in a dialog.
 * This last button only appears when the message is cropped.
 */
@Component({
  selector: 'app-table-inspect-message',
  templateUrl: 'table-inspect-message.component.html',
  styleUrl: 'table-inspect-message.component.scss',
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
  /**
   * References the title to display in the dialog.
   */
  @Input({ required: true }) label: string;
  
  /**
   * Message to display. Will be cropped if longer than 15 characters.
   * In that case, will display an "eye" button opening a dialog with the full message.
   */
  @Input({ required: true }) set message(entry: string | undefined) {
    if (entry && entry !== '') {
      if (entry.length > 15) {
        this.croppedMessage = `${entry.substring(0, 14).trimEnd()}...`;
        this._message = entry;
        this.displayEye = true;
      } else {
        this.croppedMessage = entry;
        this.displayEye = false;
      }
    }
  }

  private readonly iconsService = inject(IconsService);
  private readonly dialog = inject(MatDialog);
  private readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

  /**
   * Cropped message. Use the emptyPipe if it is undefined (no message).
   * @default undefined
   */
  croppedMessage: string | undefined;

  /**
   * Checks if the "eye" must be displayed.
   * @default false
   */
  displayEye = false;

  /**
   * Complete message.
   * @default undefined
   */
  private _message: string |undefined;

  /**
   * Retrieves a material icon with its armonik name.
   * @param icon string - armonik name of the icon
   * @returns string - material name of the icon.
   */
  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  /**
   * Opens the TableInspectMessage dialog on click.
   */
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

  /**
   * Copys the message content in the user's clipboard. Notifies them with a success notification.
   */
  copy() {
    if (this._message) {
      this.clipboard.copy(this._message);
      this.notificationService.success('Message copied');
    }
  }
}