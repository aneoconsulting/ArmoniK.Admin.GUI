import { Injectable } from '@angular/core';

@Injectable()
export class FavoritesService {
  #favorites: Map<string, string> = new Map();

  constructor() {
    this.#favorites = this.#recover();
  }

  /**
   * Add a favorite
   *
   * @param url Url to add
   * @param favoriteName name to give to an URL
   */
  add(url: string, favoriteName?: string): void {
    this.#favorites.set(url, favoriteName || url);
    this.#store();
  }

  /**
   * Remove a favorite
   *
   * @param key Key to remove
   */
  remove(key: string): void {
    this.#favorites.delete(key);
    this.#store();
  }

  /**
   * Check if a favorite exists
   *
   * @param key key to find
   */
  has(key: string): boolean {
    return this.#favorites.has(key);
  }

  /**
   * Get all favorites
   *
   * @returns All favorites
   */
  get favorites(): Map<string, string> {
    return this.#favorites;
  }

  /**
   * Store favorites in local storage
   */
  #store(): void {
    localStorage.setItem(
      'favorites',
      JSON.stringify(Array.from(this.#favorites.entries()))
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
