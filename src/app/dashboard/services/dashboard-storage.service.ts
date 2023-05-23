import { Injectable, inject } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { TasksStatusesGroup } from '../types';

@Injectable()
export class DashboardStorageService {
  #key = 'dashboard';
  #intervalKey = 'interval';
  #hideGroupsHeaderKey = 'hide_group_headers';

  #storageService = inject(StorageService);

  saveInterval(interval: number) {
    this.#storageService.setItem(this.#storageService.buildKey(this.#key, this.#intervalKey), interval.toString());
  }

  restoreInterval(): number | null {
    const interval = this.#storageService.getItem<string>(this.#storageService.buildKey(this.#key, this.#intervalKey));

    if (interval) {
      return parseInt(interval, 10);
    }

    return null;
  }

  saveHideGroupsHeader(hide: boolean) {
    this.#storageService.setItem(this.#storageService.buildKey(this.#key, this.#hideGroupsHeaderKey), hide.toString());
  }

  restoreHideGroupsHeader(): boolean | null {
    const hide = this.#storageService.getItem(this.#storageService.buildKey(this.#key, this.#hideGroupsHeaderKey));

    if (hide) {
      return hide === 'true';
    }

    return null;
  }

  saveStatusGroups(groups: TasksStatusesGroup[]) {
    this.#storageService.setItem(this.#storageService.buildKey(this.#key, 'status_groups'), groups);
  }

  restoreStatusGroups(): TasksStatusesGroup[] | null {
    const groups = this.#storageService.getItem<TasksStatusesGroup[]>(this.#storageService.buildKey(this.#key, 'status_groups'), true);

    if (groups) {
      return groups as TasksStatusesGroup[];
    }

    return null;
  }
}
