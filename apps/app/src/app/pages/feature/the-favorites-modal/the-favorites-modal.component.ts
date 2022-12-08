import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClrInputModule, ClrModalModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { FavoritesService } from '../../util';

@Component({
  standalone: true,
  selector: 'app-layouts-the-favorites-modal',
  templateUrl: './the-favorites-modal.component.html',
  styleUrls: ['./the-favorites-modal.component.scss'],
  imports: [
    FormsModule,
    ClrModalModule,
    ClrInputModule,
    TranslateModule,
    NgIf,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheFavoritesModalComponent {
  private _modalFavoriteOpened = new BehaviorSubject<boolean>(false);

  public favoriteName = '';

  constructor(
    private _router: Router,
    private _favoritesService: FavoritesService
  ) {}

  public get currentUrl(): string {
    return this._router.url;
  }

  public get isModalFavoriteOpened$(): Observable<boolean> {
    return this._modalFavoriteOpened.asObservable();
  }

  /**
   * Open the modal to add a favorite
   */
  openModalFavorites(): void {
    this._modalFavoriteOpened.next(true);
  }

  /**
   * Close the modal to add a favorite
   */
  closeModalFavorites(): void {
    this._modalFavoriteOpened.next(false);
  }

  /**
   * Add a favorite
   */
  addPageFavorite(): void {
    this._favoritesService.add(this.currentUrl, this.favoriteName);
    this.closeModalFavorites();
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
          this.openModalFavorites();
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
