import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrIconModule, ClrVerticalNavModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FavoritesService } from '../../../core';

@Component({
  standalone: true,
  selector: 'app-layouts-the-favorites-navigation',
  templateUrl: './the-favorites-navigation.component.html',
  styleUrls: ['./the-favorites-navigation.component.scss'],
  imports: [
    RouterModule,
    ClrVerticalNavModule,
    ClrIconModule,
    TranslateModule,
    NgFor,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheFavoritesNavigationComponent {
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
