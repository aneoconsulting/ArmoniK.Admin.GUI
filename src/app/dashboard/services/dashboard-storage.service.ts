import { Injectable, inject } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { TasksStatusGroup } from '../types';

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

  saveStatusGroups(groups: TasksStatusGroup[]) {
    // TODO: remove the stringify when storage service will support objects
    this.#storage.setItem(this.#buildKey(this.#key, 'status_groups'), JSON.stringify(groups));
  }

  restoreStatusGroups(): TasksStatusGroup[] | null {
    const groups = this.#storage.getItem(this.#buildKey(this.#key, 'status_groups'));

    if (groups) {
      return JSON.parse(groups);
    }

    return null;
  }

  // TODO: see table.service.ts:162
  #buildKey(tableName: string, key: string): string {
    return `${tableName}_${key}`;
  }
}
