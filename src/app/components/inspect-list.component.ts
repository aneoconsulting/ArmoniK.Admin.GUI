import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

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
  ],
  styles: [`
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .no-data {
      text-align: center;
      margin: 1rem;
      font-style: italic;
    }

    button {
      width: fit-content; 
    }

    .item {
      width: 100%;
      margin: 0.5rem;
    }

    mat-divider {
      margin-right: 0.5rem;
    }

    mat-toolbar {
      padding: 1rem;
    }
  `]
})
export class InspectListComponent {
  private _list: string[] = [];

  @Input({ required: true }) set list(entries: string[] | undefined) {
    if (entries) {
      this._list = entries;
    }
  }
  @Input({ required: false }) redirectLink: string | undefined;

  get list(): string[] {
    return this._list;
  }
}