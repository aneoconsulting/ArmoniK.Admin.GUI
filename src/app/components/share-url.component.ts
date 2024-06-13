import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconsService } from '@services/icons.service';

@Component({
  selector: 'app-share-url',
  template: `
<button mat-icon-button i18n-aria-label aria-label="Share" [cdkCopyToClipboard]="sharableURL" (cdkCopyToClipboardCopied)="onCopied()" [disabled]="copied" matTooltip="Copy Page URL" i18n-matTooltip>
  @if (copied) {
    <mat-icon aria-hidden="true" [fontIcon]="getIcon('done')"/>
  } @else {
    <mat-icon aria-hidden="true" [fontIcon]="getIcon('share')"/>
  }
</button>
  `,
  styles: [`
  `],
  standalone: true,
  imports: [
    ClipboardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class ShareUrlComponent {
  #iconsService = inject(IconsService);

  @Input({required: true}) sharableURL: string;

  public copied = false;

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  onCopied() {
    this.copied = true;

    setTimeout(() => this.copied = false, 1000);
  }
}
