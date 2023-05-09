import { Component, Input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { NgIf } from "@angular/common";


@Component({
  selector: 'app-share-url',
  template: `
  <button mat-icon-button aria-label="Share" [cdkCopyToClipboard]="sharableURL" (cdkCopyToClipboardCopied)="onCopied()" [disabled]="copied">
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
  ]
})
export class ShareUrlComponent {
  @Input({required: true}) sharableURL: string;

  public copied: boolean = false;

  onCopied() {
    this.copied = true;

    setTimeout(() => this.copied = false, 1000);
  }
}
