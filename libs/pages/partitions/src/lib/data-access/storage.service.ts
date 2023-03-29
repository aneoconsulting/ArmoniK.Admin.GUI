import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {
  constructor(private _storage: Storage) { }

  /**
 * Save value to storage.
 *
 * @param key
 * @param value
 */
  public save(key: string, value: unknown) {
    this._storage.setItem(key, JSON.stringify(value))
  }

  /**
   * Restore value from storage.
   *
   * @param key
   *
   * @returns null if value is not found in storage
   * @returns value if value is found in storage
   */
  public restore(key: string): unknown {
    const value = this._storage.getItem(key)

    if (value === null) {
      return null
    }

    return JSON.parse(value) as unknown
  }
}
