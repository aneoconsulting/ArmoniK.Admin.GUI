import { Injectable } from '@angular/core';

/**
 * Service to manage the storage for the table.
 * It's a low level service that should be used by the TableService.
 */
@Injectable()
export class TableStorageService {
  constructor(private _storage: Storage) {}

  /**
   * Save data to the storage
   */
  save(key: string, data: unknown) {
    if (typeof data === 'string') {
      this._storage.setItem(key, data);
      return;
    }

    this._storage.setItem(key, JSON.stringify(data));

    // TODO: save every key to a list of keys in order to be able to manage storage (Create a service for storage management)
  }


  /**
   * Restore data from the storage
   */
  restore<T>(key: string, parse = true) {
    const data = this._storage.getItem(key);

    if (data && parse) {
      return JSON.parse(data) as T;
    } else if (data) {
      return data as string;
    }

    return null;
  }

  remove(key: string) {
    this._storage.removeItem(key);
  }
}
