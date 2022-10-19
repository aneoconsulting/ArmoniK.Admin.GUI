import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  constructor(private _storage: Storage) {}

  public setItem(key: string, value: unknown): void {
    this._storage.setItem(key, JSON.stringify(value));
  }

  public getItem(key: string): unknown {
    return JSON.parse(this._storage.getItem(key) ?? '');
  }
}
