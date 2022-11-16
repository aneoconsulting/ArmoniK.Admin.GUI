import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  constructor(private _storage: Storage) {}

  /**
   * Get an item from the storage
   *
   * @param key Key of the item to get
   *
   * @returns The item
   */
  public get(key: string): unknown {
    return this._storage.getItem(key);
  }

  /**
   * Set a value in the storage
   *
   * @param key Key to set
   * @param value Value to set
   */
  public set(key: string, value: string): void {
    this._storage.setItem(key, value);
  }
}
