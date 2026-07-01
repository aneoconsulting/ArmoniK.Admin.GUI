import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-share-url',
  templateUrl: 'share-url.component.html',
  imports: [
    ClipboardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class ShareUrlComponent {
  private readonly iconsService = inject(IconsService);

  @Input({required: true}) sharableURL: string;

  public copied = false;

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  onCopied() {
    this.copied = true;

    setTimeout(() => this.copied = false, 1000);
  }
}
