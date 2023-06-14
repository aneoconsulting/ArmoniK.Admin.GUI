import { Injectable } from '@angular/core';

@Injectable()
export class StorageService implements Storage {
  #keysStorageKey = 'keys-storage';
  #keys: Set<string> = new Set();

  constructor(
    private _localStorage: Storage,
  ) {
    this.#restoreKeys();
  }

  get keys(): Set<string> {
    return this.#keys;
  }

  get length(): number {
    return this._localStorage.length;
  }

  clear(): void {
    this._localStorage.clear();
  }

  getItem<T>(key: string, parse = false) {
    const data = this._localStorage.getItem(key);

    if (data && parse) {
      return JSON.parse(data) as T;
    } else if (data) {
      return data;
    }

    return null;
  }

  key(index: number): string | null {
    return this._localStorage.key(index);
  }

  removeItem(key: string): void {
    this._localStorage.removeItem(key);

    this.#keys.delete(key);
    this.#saveKeys();
  }

  setItem(key: string, data: unknown): void {
    if (typeof data === 'string') {
      this._localStorage.setItem(key, data);
      return;
    }

    this._localStorage.setItem(key, JSON.stringify(data));

    this.#keys.add(key);
    this.#saveKeys();
  }

  /**
   * Build the key to store data in local storage
   */
  buildKey(tableName: string, key: string): string {
    return `${tableName}-${key}`;
  }

  exportData(): Record<string, unknown> {
    const data = {} as Record<string, unknown>;

    for (const key of this.#keys) {
      const item = this.getItem(key, true);

      if (item) {
        data[key] = item;
      }
    }

    return data;
  }

  importData(data: string): void {
    const parsedData = JSON.parse(data) as Record<string, string>;

    for (const key in parsedData) {
      this.setItem(key, parsedData[key]);
    }
  }


  #restoreKeys() {
    this.#keys = new Set(JSON.parse(this._localStorage.getItem(this.#keysStorageKey)?? '[]'));
  }

  #saveKeys() {
    this._localStorage.setItem(this.#keysStorageKey, JSON.stringify(Array.from(this.#keys)));
  }
}
