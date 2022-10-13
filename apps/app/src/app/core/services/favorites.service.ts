import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable()
export class FavoritesService {
  private _favorites: Map<string, string> = new Map();

  private favorites$: BehaviorSubject<Map<string, string>> =
    new BehaviorSubject<Map<string, string>>(this._favorites);

  constructor() {
    this._favorites = this.#recover();
    this.favorites$.next(this._favorites);
  }

  public get favorites(): Observable<{ path: string; label: string }[]> {
    const favorites$ = this.favorites$.asObservable();

    return favorites$.pipe(
      map((favorites) => {
        return Array.from(favorites.entries()).map(([path, label]) => {
          return {
            path,
            label,
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
    this._favorites.set(url, favoriteName);
    this.favorites$.next(this._favorites);

    this.#store();
  }

  /**
   * Remove a favorite
   *
   * @param key Key to remove
   */
  remove(key: string): void {
    this._favorites.delete(key);
    this.favorites$.next(this._favorites);

    this.#store();
  }

  /**
   * Check if a favorite exists
   *
   * @param key key to find
   */
  has(key: string): boolean {
    return this._favorites.has(key);
  }

  /**
   * Store favorites in local storage
   */
  #store(): void {
    localStorage.setItem(
      'favorites',
      JSON.stringify(Array.from(this._favorites.entries()))
    );
  }

  /**
   * Recover favorites from local storage
   */
  #recover(): Map<string, string> {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      return new Map(JSON.parse(favorites));
    } else {
      return new Map();
    }
  }
}
