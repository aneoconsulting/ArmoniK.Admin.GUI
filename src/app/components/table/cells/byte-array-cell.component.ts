import { Clipboard } from '@angular/cdk/clipboard';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ByteDecoderService } from '@services/byte-decoder.service';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-byte-array-cell',
  templateUrl: 'byte-array-cell.component.html',
  styleUrl: 'byte-array-cell.component.css',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [
    ByteDecoderService,
  ]
})
export class ByteArrayComponent {
  @Input({ required: true }) set data(entry: Uint8Array) {
    this.byteArray = entry;
    this.decodedData = this.byteDecoderService.decode(this.byteArray);
    if (this.decodedData === null || (this.decodedData && this.decodedData.length >= 128)) {
      this.computeByteLength(this.byteArray.byteLength);
    }
  }

  @Input({ required: true }) label: string;

  decodedData: string | null = null;
  private byteArray: Uint8Array;
  byteLength: string | null = null;

  readonly downloadTip = $localize`Download this `;
  readonly copyTip = $localize`Copy this `;

  private readonly byteDecoderService = inject(ByteDecoderService);
  private readonly iconsService = inject(IconsService);
  readonly clipboard = inject(Clipboard);

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

  copy() {
    if (this.decodedData) {
      this.clipboard.copy(this.decodedData);
    }
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  private computeByteLength(byteLength: number) {
    const sizes = ['o', 'Ko', 'Mo', 'Go'];

    let index = 0;
    while (index !== 3 && byteLength > 1000) {
      byteLength = byteLength / 1000;
      index++;
    }

    if (byteLength !== 0) {
      this.byteLength = `${byteLength.toFixed(2)} ${sizes[index]}`;
    }
  }
}