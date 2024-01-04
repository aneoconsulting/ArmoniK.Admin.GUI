import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataRaw } from '@app/types/data';
import { Page } from '@app/types/pages';
import { NotificationService } from '@services/notification.service';
import { PageHeaderComponent } from './page-header.component';
import { ShowActionsComponent } from './show-actions.component';
import { ShowCardComponent } from './show-card.component';

@Component({
  selector: 'app-show-page',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <ng-content> </ng-content>
  <span>{{ id }}</span> 
  <button mat-icon-button [cdkCopyToClipboard]="id ?? ''" (cdkCopyToClipboardCopied)="onCopiedTaskId()">
    <mat-icon aria-hidden="true" fontIcon="content_copy"></mat-icon>
  </button>
</app-page-header>

<ng-container *ngIf="data">
  <app-show-actions [type]="type" [data]="data" (cancel)="onCancel()" (refresh)="onRefresh()"></app-show-actions>
</ng-container>

<app-show-card [data]="data" [statuses]="statuses"></app-show-card>
  `,
  styles: [`
span {
  font-style: italic;
}
  `],
  standalone: true,
  providers: [
    NotificationService,
    MatSnackBar
  ],
  imports: [
    PageHeaderComponent,
    ShowCardComponent,
    ShowActionsComponent,
    CommonModule,
    NgIf,
    MatIconModule,
    ClipboardModule,
    MatButtonModule
  ]
})
export class ShowPageComponent {
  @Input({ required: true }) id: string | null = null;
  @Input({ required: true }) data: DataRaw | null = null;
  @Input() statuses: Record<number, string> = [];
  @Input() sharableURL: string | null = null;
  @Input({ required: true }) type: Page;
  @Output() cancel = new EventEmitter<never>();
  @Output() refresh = new EventEmitter<never>();

  #notificationService = inject(NotificationService);

  onCopiedTaskId() {
    this.#notificationService.success('Task ID copied to clipboard');
  }

  onCancel() {
    this.cancel.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }
}
