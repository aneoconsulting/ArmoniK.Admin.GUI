import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrIconModule, ClrVerticalNavModule } from '@clr/angular';

import { Observable } from 'rxjs';
import { FavoriteItem, FavoritesService } from '../../util';

@Component({
  standalone: true,
  selector: 'app-pages-the-favorites-navigation',
  templateUrl: './the-favorites-navigation.component.html',
  styleUrls: ['./the-favorites-navigation.component.scss'],
  imports: [
    RouterModule,
    ClrVerticalNavModule,
    ClrIconModule,
    NgFor,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheFavoritesNavigationComponent {
  constructor(private _favoritesService: FavoritesService) {}

  public get favorites$(): Observable<FavoriteItem[]> {
    return this._favoritesService.favorites$;
  }

  /**
   * Track by favorites
   *
   * @param _
   * @param item
   *
   * @returns Item path
   */
  public trackByFavorites(_: number, item: FavoriteItem): string {
    return item.label;
  }

  public generateRouterLink(url: string[]): string[] {
    return ['/', ...url];
  }
}
