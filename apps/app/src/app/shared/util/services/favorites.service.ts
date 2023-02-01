import { Injectable } from '@angular/core';
import { UrlSerializer, Params } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

export type FavoriteItem = {
  url: string;
  queryParams: Params;
  label: string;
};

@Injectable()
export class FavoritesService {
  private _favorites = new BehaviorSubject<Map<string, string>>(new Map());

  constructor(
    private _storage: Storage,
    private _urlSerializer: UrlSerializer
  ) {
    this._favorites.next(this._recover());
  }

  public get favorites$(): Observable<FavoriteItem[]> {
    return this._favorites.pipe(
      map((favorites) => {
        return Array.from(favorites.entries()).map(([url, label]) => {
          const urlTree = this._urlSerializer.parse(url);
          const root = urlTree.root;
          const queryParams = urlTree.queryParams;

          if (!root.children['primary']) {
            return {
              label,
              url: url,
              queryParams: queryParams,
            };
          }

          return {
            label,
            url: root.children['primary'].segments
              .map((segment) => segment.path)
              .join('/'),
            queryParams: queryParams,
          };
        });
      })
    );
  }

  /**
   * Add a favorite
   *
   * @param url Url to add
   * @param favoriteName name to give to an URL
   */
  add(url: string, favoriteName: string): void {
    this._favoritesValue.set(url, favoriteName);
    this._favorites.next(this._favoritesValue);

    this._store();
  }

  /**
   * Remove a favorite
   *
   * @param key Key to remove
   */
  remove(key: string): void {
    this._favoritesValue.delete(key);
    this._favorites.next(this._favoritesValue);

    this._store();
  }

  /**
   * Get favorites name using a key
   *
   * @param key key to find
   */
  get(key: string): string | null {
    return this._favoritesValue.get(key) ?? null;
  }

  private get _favoritesValue(): Map<string, string> {
    return this._favorites.getValue();
  }

  /**
   * Store favorites in local storage
   */
  private _store(): void {
    this._storage.setItem(
      'favorites',
      JSON.stringify(Array.from(this._favoritesValue.entries()))
    );
  }

  /**
   * Recover favorites from local storage
   */
  private _recover(): Map<string, string> {
    const favorites = this._storage.getItem('favorites');
    if (favorites) {
      return new Map(JSON.parse(favorites));
    } else {
      return new Map();
    }
  }
}
