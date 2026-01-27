import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';

export interface TableInspectMessageDialogData {
  label: string;
  message: string;
}

/**
 * Displays a message associated to an ArmonikData in a angular material dialog.
 */
@Component({
  selector: 'app-inspect-message-dialog',
  templateUrl: 'table-inspect-message-dialog.component.html',
  styleUrl: 'table-inspect-message-dialog.component.scss',
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
  /**
   * Label of the dialog, also referenced as its title.
   */
  label: string;

  /**
   * Message to display, associated to an ArmonikData.
   */
  message: string;
  
  constructor(@Inject(MAT_DIALOG_DATA) data: TableInspectMessageDialogData) {
    this.label = data.label;
    this.message = data.message;
  }

  private readonly iconsService = inject(IconsService);
  private readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

  /**
   * Copy the message content in the user's clipboard. Notifies them with a success notification.
   */
  copy() {
    this.clipboard.copy(this.message);
    this.notificationService.success('Message copied');
  }

  /**
   * Retrieves a material icon with its armonik name.
   * @param icon string - armonik name of the icon
   * @returns string - material name of the icon.
   */
  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }
}