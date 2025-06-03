import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  ]
})
export class ByteArrayComponent {
  @Input({ required: true }) set data(entry: Uint8Array) {
    this.array = entry.buffer;
    this.computeByteLength(entry.buffer.byteLength);
  }

  @Input({ required: true }) label: string;

  private array: ArrayBufferLike;
  byteLength: string | null = null;
  tooltip = $localize`Download this `;

  private readonly iconsService = inject(IconsService);

  download() {
    const blob = new Blob([this.array], {
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