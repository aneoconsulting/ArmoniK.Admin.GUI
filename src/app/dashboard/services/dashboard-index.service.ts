import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { TasksStatusesService } from '@app/tasks/services/task-status.service';
import { DefaultConfigService } from '@services/default-config.service';
import { DashboardStorageService } from './dashboard-storage.service';
import { TasksStatusesGroup } from '../types';

@Injectable()
export class DashboardIndexService {
  #defaultConfigService = inject(DefaultConfigService);
  #dashboardStorageService = inject(DashboardStorageService);
  #tasksStatusesService = inject(TasksStatusesService);

  readonly defaultStatusGroups: TasksStatusesGroup[] = this.#defaultConfigService.defaultDashboardStatusGroups;
  readonly defaultHideGroupsHeader = this.#defaultConfigService.defaultDashboardHideGroupsHeader;
  readonly defaultInterval = this.#defaultConfigService.defaultDashboardInterval;


  // TODO: move to TasksStatusesService
  statuses(): { value: string, name: string }[] {
    const values = Object.values(this.#tasksStatusesService.statuses).sort();
    const keys = Object.keys(this.#tasksStatusesService.statuses).sort();
    const sortedKeys = values.map((value) => {
      return keys.find((key) => {
        return this.#tasksStatusesService.statuses[Number(key) as TaskStatus] === value;
      });
    });

    return (sortedKeys.filter(Boolean) as string[]).map((key) => {
      const status = Number(key) as TaskStatus;
      return {
        value: key,
        name: this.#tasksStatusesService.statusToLabel(status)
      };
    });
  }

  restoreStatusGroups(): TasksStatusesGroup[] {
    return this.#dashboardStorageService.restoreStatusGroups() ?? this.defaultStatusGroups;
  }

  saveStatusGroups(groups: TasksStatusesGroup[]) {
    this.#dashboardStorageService.saveStatusGroups(groups);
  }

  restoreIntervalValue(): number {
    const storedValue = this.#dashboardStorageService.restoreInterval();

    if(storedValue === null) {
      return this.defaultInterval;
    }

    return storedValue;
  }

  saveIntervalValue(interval: number) {
    this.#dashboardStorageService.saveInterval(interval);
  }

  restoreHideGroupsHeader(): boolean {
    const storedValue = this.#dashboardStorageService.restoreHideGroupsHeader();

    if(storedValue === null) {
      return this.defaultHideGroupsHeader;
    }

    return storedValue;
  }

  saveHideGroupsHeader(hide: boolean) {
    this.#dashboardStorageService.saveHideGroupsHeader(hide);
  }
}
