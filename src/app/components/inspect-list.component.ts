import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { IconsService } from '@services/icons.service';

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
    MatIconModule,
    MatButtonModule,
    RouterModule
  ],
  providers: [
    IconsService
  ],
  styles: [`
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    ul {
      list-style: inside;
      margin: 0;
    }

    li {
      list-style-position: initial;
      padding: 0.5rem;
    }

    section {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  `]
})
export class InspectListComponent {
  private readonly iconsService = inject(IconsService);
  readonly eyeIcon = this.iconsService.getIcon('view');
  private _list: string[] = [];

  @Input({ required: true }) set list(entries: string[] | undefined) {
    if (entries) {
      this._list = entries;
    }
  }
  @Input({ required: false }) redirectLink: string | undefined;

  get list() {
    return this._list;
  }
}