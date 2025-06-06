import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PrettyPipe } from '@pipes/pretty.pipe';
import { ByteArrayService } from '@services/byte-array.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';

/**
 * Displays a byte array in armonik inspection pages.
 */
@Component({
  selector: 'app-byte-array-inspection',
  templateUrl: 'byte-array.component.html',
  styleUrl: 'byte-array.component.css',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    PrettyPipe,
  ],
  providers: [
    ByteArrayService,
    NotificationService,
  ]
})
export class ByteArrayComponent {
  @Input({ required: true }) set data(entry: Uint8Array) {
    this.byteArray = entry;
    this.decodedData = this.byteArrayService.decode(this.byteArray);
    this.byteLength = this.byteArrayService.byteLengthToString(this.byteArray.byteLength);
  }

  @Input({ required: true }) label: string | number | symbol;

  private byteArray: Uint8Array;
  decodedData: string | null = null;
  byteLength: string | null = null;

  private readonly byteArrayService = inject(ByteArrayService);
  private readonly iconsService = inject(IconsService);
  private readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

  /**
   * Returns the icon associated with that name.
   * @param name string
   * @returns string
   */
  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  /**
   * Download the byteArray in a binary file. 
   * @todo Will be replaced when the "download service" is merged.
   */
  download() {
    const blob = new Blob([this.byteArray], {
      type: 'application/octet-stream'
    });
    const url = URL.createObjectURL(blob);

    const date = new Date();
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${date.toISOString().slice(0, 10)}-${this.label.toString().toLocaleLowerCase().replaceAll(' ', '-')}`;
    anchor.click();

    URL.revokeObjectURL(url);
    anchor.remove();
  }

  /**
   * Copy the value of the decoded byteArray into the user's clipboard.
   * Notifies the user.
   */
  copy() {
    if (this.decodedData) {
      this.clipboard.copy(this.decodedData);
      this.notificationService.success('Copied to clipboard');
    }
  }
}