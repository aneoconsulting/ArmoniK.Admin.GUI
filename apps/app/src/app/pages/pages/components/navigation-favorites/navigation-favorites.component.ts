import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrVerticalNavModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FavoritesService } from '../../../../core';

@Component({
  standalone: true,
  selector: 'app-pages-navigation-favorites',
  templateUrl: './navigation-favorites.component.html',
  styleUrls: ['./navigation-favorites.component.scss'],
  imports: [CommonModule, RouterModule, ClrVerticalNavModule, TranslateModule],
})
export class NavigationFavoritesComponent {
  constructor(private _favoritesService: FavoritesService) {}

  public get favorites$(): Observable<{ path: string; label: string }[]> {
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
  public trackByFavorites(
    _: number,
    item: { path: string; label: string }
  ): string {
    return item.path;
  }
}
