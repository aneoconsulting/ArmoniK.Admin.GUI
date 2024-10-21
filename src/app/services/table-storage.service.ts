import { Injectable, inject } from '@angular/core';
import { Key } from '@app/types/config';
import { StorageService } from './storage.service';

/**
 * Service to manage the storage for the table.
 * It's a low level service that should be used by the TableService.
 */
@Injectable()
export class TableStorageService {
  private readonly storage = inject(StorageService);

  /**
   * Save data to the storage
   */
  save(key: Key, data: unknown) {
    this.storage.setItem(key, data);
  }

  /**
   * Restore data from the storage
   */
  restore<T>(key: Key, parse = true) {
    return this.storage.getItem<T>(key, parse);
  }

  /**
   * Remove data from the storage
   */
  remove(key: Key) {
    this.storage.removeItem(key);
  }
}
