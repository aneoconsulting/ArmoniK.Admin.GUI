import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable()
export class FavoritesService {
  private _favorites: Map<string, string> = new Map();
  private _favoritesSubject = new BehaviorSubject<Map<string, string>>(
    this._favorites
  );
  private _favorites$ = this._favoritesSubject.pipe(
    tap((favorites) => this._store(favorites))
  );

  constructor(private _storage: Storage) {
    this._favorites = this._recover();
    this._favoritesSubject.next(this._favorites);
  }

  public get favorites$(): Observable<{ path: string; label: string }[]> {
    return this._favorites$.pipe(
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
    this._favoritesSubject.next(this._favorites);
  }

  /**
   * Remove a favorite
   *
   * @param key Key to remove
   */
  remove(key: string): void {
    this._favorites.delete(key);
    this._favoritesSubject.next(this._favorites);
  }

  /**
   * Check if a favorite exists
   *
   * @param key key to find
   */
  has$(key: string): Observable<boolean> {
    return this._favorites$.pipe(
      map((favorites) => {
        return favorites.has(key);
      })
    );
  }

  /**
   * Get favorites name using a key
   *
   * @param key key to find
   */
  get$(key: string): Observable<string | undefined> {
    return this._favorites$.pipe(
      map((favorites) => {
        return favorites.get(key);
      })
    );
  }

  /**
   * Store favorites in local storage
   */
  private _store(favorites: Map<string, string>): void {
    this._storage.setItem(
      'favorites',
      JSON.stringify(Array.from(favorites.entries()))
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
