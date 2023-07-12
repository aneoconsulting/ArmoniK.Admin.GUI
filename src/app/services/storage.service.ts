import { Injectable, inject } from '@angular/core';
import { createDefu, defu } from 'defu';
import { Key } from '@app/types/config';
import { DefaultConfigService } from './default-config.service';

@Injectable()
export class StorageService implements Storage {
  #defaultConfigService = inject(DefaultConfigService);
  #localStorage = inject(Storage);

  get length(): number {
    return this.#localStorage.length;
  }

  clear(): void {
    this.#localStorage.clear();
  }

  getItem<T>(key: Key, parse = false) {
    const data = this.#localStorage.getItem(key);

    if (data && parse) {
      try {
        return JSON.parse(data) as T;
      } catch (e) {
        return data;
      }
    } else if (data) {
      return data;
    }

    return null;
  }

  key(index: number): string | null {
    return this.#localStorage.key(index);
  }

  removeItem(key: Key): void {
    this.#localStorage.removeItem(key);
  }

  setItem(key: Key, data: unknown): void {
    if (typeof data === 'string') {
      this.#localStorage.setItem(key, data);
    } else {
      this.#localStorage.setItem(key, JSON.stringify(data));
    }
  }

  exportData(): Record<string, unknown> {
    const data = {} as Record<string, unknown>;

    for (const key of this.keys) {
      const item = this.getItem(key, true);

      if (item) {
        data[key] = item;
      }
    }

    return this.#defu()(data, this.#defaultConfigService.exportedDefaultConfig);
  }

  importData(data: string): void {
    const parsedData = JSON.parse(data) as Record<string, string>;

    const keys = Object.keys(parsedData);
    const defaultKeys = Object.keys(this.#defaultConfigService.exportedDefaultConfig) as Key[];

    for (const key in keys) {
      // We only import keys that are supported.
      if (defaultKeys.includes(key as Key)) {
        this.setItem(key as Key, parsedData[key]);
      } else {
        console.warn(`Key "${key}" is not supported`);
      }
    }
  }

  get keys(): Key[] {
    const defaultKeys = Object.keys(this.#defaultConfigService.exportedDefaultConfig);
    const dirtyKeys = Object.keys(this.#localStorage);

    return dirtyKeys.filter((key) => defaultKeys.includes(key)) as Key[];
  }

  restoreKeys(): Set<Key> {
    return new Set(this.keys);
  }

  #defu() {
    // If array, we return the storage array instead of merging it with default config.
    return createDefu((obj, key, value) => {
      if (Array.isArray(obj[key]) && Array.isArray(value)) {
        obj[key] = value;
        return true;
      }
      return;
    });
  }
}
