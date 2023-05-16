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

  getItem(key: string): string | null {
    return this._localStorage.getItem(key);
  }

  key(index: number): string | null {
    return this._localStorage.key(index);
  }

  removeItem(key: string): void {
    this._localStorage.removeItem(key);

    this.#keys.delete(key);
    this.#saveKeys();
  }

  setItem(key: string, value: string): void {
    this._localStorage.setItem(key, value);

    this.#keys.add(key);
    this.#saveKeys();
  }

  #restoreKeys() {
    this.#keys = new Set(JSON.parse(this._localStorage.getItem(this.#keysStorageKey)?? '[]'));
  }

  #saveKeys() {
    this._localStorage.setItem(this.#keysStorageKey, JSON.stringify(Array.from(this.#keys)));
  }

}
