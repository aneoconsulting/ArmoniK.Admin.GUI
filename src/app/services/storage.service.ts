import { Injectable, inject } from '@angular/core';
import { ExportedDefaultConfig, Key } from '@app/types/config';
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

  /**
   * @param key type [key](../types/config.ts)
   * @param parse boolean, either you want to parse the JSON data or not. Default=false
   * @returns the parsed/unparsed data.
   */
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

  /**
   * @param index 
   * @returns the key stored at the provided index or null if not found
   */
  key(index: number): string | null {
    return this.#localStorage.key(index);
  }

  removeItem(key: Key): void {
    this.#localStorage.removeItem(key);
  }

  /**
   * @param key type [key](../types/config.ts)
   * @param data the data to store, will be stringified if not already.
   */
  setItem(key: Key, data: unknown): void {
    if (typeof data === 'string') {
      this.#localStorage.setItem(key, data);
    } else {
      this.#localStorage.setItem(key, JSON.stringify(data));
    }
  }

  /**
   * Retrieve all the data located in the store, and export it regarding the default config of armonik.
   * @returns the different configurations of armonik GUI.
   */
  exportData(): Record<string, unknown> {
    const data = {} as Record<string, unknown>;

    for (const key of this.keys) {
      const item = this.getItem(key, true);

      if (item) {
        data[key] = item;
      }
    }

    return data;
  }

  /**
   * Stores the provided JSON data in the local storage of the application.
   * If there is already some data stored, it will NOT be overridden.
   * @param data - JSON object from server.
   */
  importConfigurationFromServer(data: Partial<ExportedDefaultConfig>) {
    const keys = Object.keys(this.#defaultConfigService.exportedDefaultConfig) as Key[];
    for (const key of keys) {
      if (!this.getItem(key) && data[key] !== undefined && data[key] !== null) {
        this.setItem(key, data[key]);
      }
    }
  }

  /**
   * Stores the provided JSON data in the local storage of the application.
   * Prints warning in case of invalid data.
   * @param data - JSON object you want to store. Either an object or an array.
   */
  importData(data: string): void {
    try {
      const parsedData = JSON.parse(data) as Record<string, string>;

      if (Array.isArray(parsedData)) {
        for (const data in parsedData) {
          this.#importDataObject(JSON.parse(data) as Record<string, string>);
        }
      }
      else {
        this.#importDataObject(parsedData);
      }
    } catch (e) {
      console.warn('Data format is not supported');
    }
  }

  /**
   * Takes a JSON object and store it into the storage
   * The JSON keys must be of type [key](../types/config.ts)
   * @param data - JSON data.
   */
  #importDataObject(data: Record<string, string>) {
    const defaultKeys = Object.keys(this.#defaultConfigService.exportedDefaultConfig) as Key[];
    const keys = Object.keys(data);
    for (const key of keys) {
      // We only import keys that are supported.
      if (defaultKeys.includes(key as Key)) {
        this.setItem(key as Key, data[key]);
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

  /**
   * @returns a new set of the stored keys 
   */
  restoreKeys(): Set<Key> {
    return new Set(this.keys);
  }
}
