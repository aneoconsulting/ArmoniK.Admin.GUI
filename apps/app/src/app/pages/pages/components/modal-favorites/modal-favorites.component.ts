import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FavoritesService } from '../../../../core';

@Component({
  selector: 'app-pages-modal-favorites',
  templateUrl: './modal-favorites.component.html',
  styleUrls: ['./modal-favorites.component.scss'],
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
   * Check if a favorite exists
   */
  hasCurrentPageFavorite(): boolean {
    return this._favoritesService.has(this.currentUrl);
  }

  /**
   * Handle favorite click
   */
  onFavoriteClick(): void {
    if (this.hasCurrentPageFavorite()) {
      this.removePageFavorite();
    } else {
      this.openModal();
    }
  }
}
