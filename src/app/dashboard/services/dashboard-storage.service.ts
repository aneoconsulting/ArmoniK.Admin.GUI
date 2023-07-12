import { Injectable, inject } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { TasksStatusesGroup } from '../types';

@Injectable()
export class DashboardStorageService {

  #storageService = inject(StorageService);

  saveInterval(interval: number) {
    this.#storageService.setItem('dashboard-interval', interval.toString());
  }

  restoreInterval(): number | null {
    const interval = this.#storageService.getItem<string>('dashboard-interval');

    if (interval) {
      return parseInt(interval, 10);
    }

    return null;
  }

  saveHideGroupsHeader(hide: boolean) {
    this.#storageService.setItem('dashboard-hide-groups-headers', hide.toString());
  }

  restoreHideGroupsHeader(): boolean | null {
    const hide = this.#storageService.getItem('dashboard-hide-groups-headers');

    if (hide) {
      return hide === 'true';
    }

    return null;
  }

  saveStatusGroups(groups: TasksStatusesGroup[]) {
    this.#storageService.setItem('dashboard-status-groups', groups);
  }

  restoreStatusGroups(): TasksStatusesGroup[] | null {
    const groups = this.#storageService.getItem<TasksStatusesGroup[]>('dashboard-status-groups', true);

    if (groups) {
      return groups as TasksStatusesGroup[];
    }

    return null;
  }
}
