import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoritesService } from '../../../../core';

@Component({
  selector: 'app-pages-navigation-favorites',
  templateUrl: './navigation-favorites.component.html',
  styleUrls: ['./navigation-favorites.component.scss'],
})
export class NavigationFavoritesComponent {
  constructor(private _favoritesService: FavoritesService) {}

  public get favorites$(): Observable<{ path: string; label: string }[]> {
    return this._favoritesService.favorites$;
  }

  /**
   * Track by favorites
   *
   * @param index
   * @param favorite
   */
  public trackByFavorites(
    _: number,
    item: { path: string; label: string }
  ): string {
    return item.path;
  }
}
