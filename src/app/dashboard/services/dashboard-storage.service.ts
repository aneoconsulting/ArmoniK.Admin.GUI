import { Injectable, inject } from '@angular/core';
import { StorageService } from '@services/storage.service';

@Injectable()
export class DashboardStorageService {
  #key = 'dashboard';
  #intervalKey = 'interval';
  #hideGroupsHeaderKey = 'hide_group_headers';

  #storage = inject(StorageService);

  saveInterval(interval: number) {
    this.#storage.setItem(this.#buildKey(this.#key, this.#intervalKey), interval.toString());
  }

  restoreInterval(): number | null {
    const interval = this.#storage.getItem(this.#buildKey(this.#key, this.#intervalKey));

    if (interval) {
      return parseInt(interval, 10);
    }

    return null;
  }

  saveHideGroupsHeader(hide: boolean) {
    this.#storage.setItem(this.#buildKey(this.#key, this.#hideGroupsHeaderKey), hide.toString());
  }

  restoreHideGroupsHeader(): boolean | null {
    const hide = this.#storage.getItem(this.#buildKey(this.#key, this.#hideGroupsHeaderKey));

    if (hide) {
      return hide === 'true';
    }

    return null;
  }

  // TODO: see table.service.ts:162
  #buildKey(tableName: string, key: string): string {
    return `${tableName}_${key}`;
  }
}
