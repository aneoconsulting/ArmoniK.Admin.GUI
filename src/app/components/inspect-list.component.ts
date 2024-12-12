import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Params, Router, RouterModule } from '@angular/router';
import { Scope } from '@app/types/config';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { FiltersCacheService } from '@services/filters-cache.service';
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
  private filters: FiltersOr<FiltersEnums, FiltersOptionsEnums> = [];

  private readonly filtersCacheService = inject(FiltersCacheService);
  private readonly iconsService = inject(IconsService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);
  readonly clipboard = inject(Clipboard);

  @Input({ required: true }) set list(entries: string[] | undefined) {
    if (entries) {
      this._list = entries;
    }
  }

  @Input({ required: false }) set queryParams(entry: string | undefined) {
    this._queryParams = {};
    if (entry && this.list.length !== 0) {
      if (this.list.length > 50) {
        const _for = entry.slice(2, 6) as 'custom' | 'root' | 'options';
        const field = Number(entry.slice(7, 8));
        const operator = Number(entry.slice(9, 10));
        this.list.forEach((value) => {
          this.filters.push([{
            for: _for,
            field: field,
            operator: operator,
            value: value,
          }]);
        });
      } else {
        const paramsKey = entry.slice(1);
        this.list.forEach((value, index) => {
          const key = `${index}${paramsKey}`;
          this._queryParams[key] = value;
        });
      }
    }
  }

  @Input({ required: false }) redirectLink: Scope | undefined;

  get list(): string[] {
    return this._list;
  }

  getIcon(name: string) {
    return this.iconsService.getIcon(name);
  }

  copy(value: string) {
    this.clipboard.copy(value);
    this.notificationService.success('Id copied');
  }

  navigate() {
    if (this.redirectLink) {
      if (this.filters.length !== 0) {
        this.filtersCacheService.set(this.redirectLink, this.filters);
      }
      this.router.navigate([`/${this.redirectLink}`], { queryParams: this._queryParams });
    }
  }
}