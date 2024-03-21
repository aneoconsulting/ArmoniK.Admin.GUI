import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { ShowActionButton } from '@app/types/components/show';
import { DataRaw } from '@app/types/data';
import { NotificationService } from '@services/notification.service';
import { PageHeaderComponent } from './page-header.component';
import { ShowActionsComponent } from './show-actions.component';
import { ShowCardComponent } from './show-card.component';

@Component({
  selector: 'app-show-page',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <ng-content></ng-content>
  <span>{{ id }}</span> 
  <button mat-icon-button [cdkCopyToClipboard]="id ?? ''" (cdkCopyToClipboardCopied)="onCopiedTaskId()">
    <mat-icon aria-hidden="true" fontIcon="content_copy" />
  </button>
</app-page-header>

<app-show-actions [actionsButton]="actionsButton" (refresh)="onRefresh()" />

<app-show-card [data$]="data$" [statuses]="statuses" />
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
export class ShowPageComponent<T extends DataRaw>{
  @Input({ required: true }) id: string | null = null;
  @Input({ required: true }) data$: Subject<T>;
  @Input() statuses: Record<number, string> = [];
  @Input() sharableURL: string | null = null;
  @Input({ required: true }) actionsButton: ShowActionButton[];
  @Output() refresh = new EventEmitter<never>();

  #notificationService = inject(NotificationService);

  onCopiedTaskId() {
    this.#notificationService.success('Task ID copied to clipboard');
  }

  onRefresh() {
    this.refresh.emit();
  }
}
