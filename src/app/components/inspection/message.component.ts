import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PrettyPipe } from '@pipes/pretty.pipe';
import { NotificationService } from '@services/notification.service';

@Component({
  selector: 'app-message',
  templateUrl: 'message.component.html',
  styleUrl: 'message.component.css',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    PrettyPipe,
  ]
})
export class MessageComponent {
  @Input({ required: true }) message: string | undefined;

  @Input({ required: false }) set label(entry: string | number | symbol | undefined) {
    if (entry) {
      this._label = entry.toString();
    }
  }

  private _label = $localize`Message`;

  get label(): string {
    return this._label;
  }

  readonly copyIcon = 'content_copy';

  private readonly clipboard = inject(Clipboard);
  private readonly notificationService = inject(NotificationService);

  copy() {
    if (this.message) {
      this.clipboard.copy(this.message);
      this.notificationService.success('Message copied');
    }
  }
}