import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ByteArrayService } from '@services/byte-array.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';

/**
 * Displays a byte array in armonik tables.
 * The displays depends on 4 conditions:
 * - A readable string with a length equal or superior than 128 characters: "Large [Binary size (o)] [download button]"
 * - A readable string with a length inferior than 128 characters: "[string] [copy button] [download button]"
 * - A non-readable string: "Binary [Binary size (o)] [download button]"
 * - Bytelength equal to 0: "-"
 */
@Component({
  selector: 'app-byte-array-cell',
  templateUrl: 'byte-array-cell.component.html',
  styleUrl: 'byte-array-cell.component.css',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
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
    if (this.decodedData === null || (this.decodedData && this.decodedData.length >= 128)) {
      this.byteLength = this.byteArrayService.byteLengthToString(this.byteArray.byteLength);
    }
  }

  @Input({ required: true }) label: string;

  decodedData: string | null = null;
  private byteArray: Uint8Array;
  byteLength: string | null = null;

  readonly downloadTip = $localize`Download this `;
  readonly copyTip = $localize`Copy this `;

  private readonly byteArrayService = inject(ByteArrayService);
  private readonly iconsService = inject(IconsService);
  readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

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
    anchor.download = `${date.toISOString().slice(0, 10)}-${this.label.toLocaleLowerCase().replaceAll(' ', '-')}`;
    anchor.click();

    URL.revokeObjectURL(url);
    anchor.remove();
  }

  /**
   * Copy the value of the decoded byteArray into the user's clipboard.
   */
  copy() {
    if (this.decodedData) {
      this.clipboard.copy(this.decodedData);
      this.notificationService.success('Copied to clipboard');
    }
  }

  /**
   * Returns the icon associated with that name.
   * @param name string
   * @returns string
   */
  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }
}