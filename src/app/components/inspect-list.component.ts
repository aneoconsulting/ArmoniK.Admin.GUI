import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Params, RouterModule } from '@angular/router';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';

/**
 * The inspect list component provide a way to display lists inside a Mat-Card.
 * @property { string[] | undefined } list - Displayed list
 * @property { string | undefined } redirectLink - Where lists items redirect
 */
@Component({
  selector: 'app-inspect-list',
  templateUrl: 'inspect-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatDivider,
    MatIconModule,
  ],
  styleUrl: 'inspect-list.component.css',
})
export class InspectListComponent {
  private _list: string[] = [];
  private _queryParams: Params;

  private readonly iconsService = inject(IconsService);
  private readonly notificationService = inject(NotificationService);
  readonly clipboard = inject(Clipboard);

  @Input({ required: true }) set list(entries: string[] | undefined) {
    if (entries) {
      this._list = entries;
    }
  }

  @Input({ required: false }) set queryParams(entry: string | undefined) {
    if (entry && this.list.length !== 0) {
      this._queryParams = {};
      const paramsKey = entry.slice(1);
      this.list.forEach((value, index) => {
        const key = `${index}${paramsKey}`;
        this._queryParams[key] = value;
      });
    }
  }

  @Input({ required: false }) redirectLink: string | undefined;

  get list(): string[] {
    return this._list;
  }

  get queryParams(): Params {
    return this._queryParams;
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  copy(value: string) {
    this.clipboard.copy(value);
    this.notificationService.success('Id copied');
  }
}