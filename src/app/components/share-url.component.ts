import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-share-url',
  template: `
  <button mat-icon-button aria-label="Share" [cdkCopyToClipboard]="sharableURL" (cdkCopyToClipboardCopied)="onCopied()" [disabled]="copied" [matTooltip]="sharableURL">
    <mat-icon aria-hidden="true" fontIcon="share" *ngIf="!copied"></mat-icon>
    <mat-icon aria-hidden="true" fontIcon="done" *ngIf="copied"></mat-icon>
  </button>
  `,
  styles: [`
  `],
  standalone: true,
  imports: [
    NgIf,
    ClipboardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ]
})
export class ShareUrlComponent {
  @Input({required: true}) sharableURL: string;

  public copied = false;

  onCopied() {
    this.copied = true;

    setTimeout(() => this.copied = false, 1000);
  }
}
