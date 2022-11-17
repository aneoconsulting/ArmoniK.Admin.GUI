import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClrIconModule, ClrInputModule, ClrModalModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { first, Observable } from 'rxjs';
import { FavoritesService } from '../../../../core';

@Component({
  standalone: true,
  selector: 'app-pages-modal-favorites',
  templateUrl: './modal-favorites.component.html',
  styleUrls: ['./modal-favorites.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ClrInputModule,
    ClrModalModule,
    ClrIconModule,
    TranslateModule,
  ],
})
export class ModalFavoritesComponent {
  isOpened = false;
  favoriteName = '';

  constructor(
    private _router: Router,
    private _favoritesService: FavoritesService
  ) {}

  public get currentUrl(): string {
    return this._router.url;
  }

  /**
   * Open the modal to add a favorite
   */
  openModal(): void {
    this.isOpened = true;
  }

  /**
   * Close the modal to add a favorite
   */
  closeModal(): void {
    this.isOpened = false;
  }

  /**
   * Add a favorite
   */
  addPageFavorite(): void {
    this._favoritesService.add(this.currentUrl, this.favoriteName);
    this.closeModal();
  }

  /**
   * Remove a favorite
   */
  removePageFavorite(): void {
    this._favoritesService.remove(this.currentUrl);
  }

  /**
   * Toggle a favorite
   */
  togglePageFavorite(): void {
    this.hasCurrentPageFavorite$()
      .pipe(first())
      .subscribe((has) => {
        if (has) {
          this.removePageFavorite();
        } else {
          this.openModal();
        }
      });
  }

  /**
   * Check if a favorite exists
   */
  hasCurrentPageFavorite$(): Observable<boolean> {
    return this._favoritesService.has$(this.currentUrl);
  }

  /**
   * Get the favorite name
   */
  getFavoriteName$(): Observable<string | undefined> {
    return this._favoritesService.get$(this.currentUrl);
  }
}
