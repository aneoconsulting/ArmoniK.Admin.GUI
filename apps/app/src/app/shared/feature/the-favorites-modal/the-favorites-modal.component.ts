import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ClrInputModule, ClrModalModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subscription, filter } from 'rxjs';
import { FavoritesService } from '../../util';

@Component({
  standalone: true,
  selector: 'app-pages-the-favorites-modal',
  templateUrl: './the-favorites-modal.component.html',
  styleUrls: ['./the-favorites-modal.component.scss'],
  imports: [
    FormsModule,
    ClrModalModule,
    ClrInputModule,
    TranslateModule,
    NgIf,
    AsyncPipe,
    JsonPipe,
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheFavoritesModalComponent implements OnInit, OnDestroy {
  private _eventsSubscription: Subscription | null = null;

  private _modalFavoriteOpened = new BehaviorSubject<boolean>(false);

  public currentFavoriteName: string | null = null;
  public favoriteName = '';

  constructor(
    private _router: Router,
    private _favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this._eventsSubscription = this._router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {
        console.log(
          'TheFavoritesModalComponent.ngOnInit()',
          this._favoritesService.get(this.currentUrl)
        );
        this.currentFavoriteName = this._favoritesService.get(this.currentUrl);
      });
  }

  ngOnDestroy(): void {
    if (this._eventsSubscription) {
      this._eventsSubscription.unsubscribe();
    }
  }

  public get currentUrl(): string {
    return this._router.url;
  }

  public get isModalFavoriteOpened$(): Observable<boolean> {
    return this._modalFavoriteOpened.asObservable();
  }

  /**
   * Open the modal to add a favorite
   */
  public openModalFavorites(): void {
    this._modalFavoriteOpened.next(true);
  }

  /**
   * Close the modal to add a favorite
   */
  public closeModalFavorites(): void {
    this._modalFavoriteOpened.next(false);
  }

  /**
   * Add a favorite
   */
  public addPageFavorite(): void {
    this._favoritesService.add(this.currentUrl, this.favoriteName);
    this.currentFavoriteName = this.favoriteName;
    this.closeModalFavorites();
  }

  /**
   * Remove a favorite
   */
  public removePageFavorite(): void {
    this._favoritesService.remove(this.currentUrl);
    this.currentFavoriteName = null;
  }

  /**
   * Toggle a favorite
   */
  togglePageFavorite(): void {
    if (this.currentFavoriteName) {
      this.removePageFavorite();
    } else {
      this.openModalFavorites();
    }
  }
}
