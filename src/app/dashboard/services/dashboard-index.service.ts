import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { DashboardStorageService } from './dashboard-storage.service';
import { TasksStatusGroup } from '../types';

@Injectable()
export class DashboardIndexService {
  readonly statusValuesToLabels: Record<TaskStatus, string> = {
    [TaskStatus.TASK_STATUS_UNSPECIFIED]: 'Unspecified',
    [TaskStatus.TASK_STATUS_DISPATCHED]: 'Dispatched',
    [TaskStatus.TASK_STATUS_CREATING]: 'Creating',
    [TaskStatus.TASK_STATUS_SUBMITTED]: 'Submitted',
    [TaskStatus.TASK_STATUS_PROCESSING]: 'Processing',
    [TaskStatus.TASK_STATUS_PROCESSED]: 'Processed',
    [TaskStatus.TASK_STATUS_CANCELLING]: 'Cancelling',
    [TaskStatus.TASK_STATUS_CANCELLED]: 'Cancelled',
    [TaskStatus.TASK_STATUS_COMPLETED]: 'Finished',
    [TaskStatus.TASK_STATUS_ERROR]: 'Error',
    [TaskStatus.TASK_STATUS_TIMEOUT]: 'Timeout',
  };

  readonly defaultStatusGroups: TasksStatusGroup[] = [
    {
      name: 'Finished',
      color: '#00ff00',
      status: [
        TaskStatus.TASK_STATUS_COMPLETED,
        TaskStatus.TASK_STATUS_CANCELLED,
      ]
    },
    {
      name: 'Running',
      color: '#ffa500',
      status: [
        TaskStatus.TASK_STATUS_PROCESSING,
      ]
    },
    {
      name: 'Error',
      color: '#ff0000',
      status: [
        TaskStatus.TASK_STATUS_ERROR,
        TaskStatus.TASK_STATUS_TIMEOUT,
      ]
    },
  ];

  readonly defaultHideGroupsHeader = false;
  readonly defaultIntervalValue = 5;

  #dashboardStorageService = inject(DashboardStorageService);

  statuses(): { value: string, name: string }[] {
    const values = Object.values(this.statusValuesToLabels).sort();
    const keys = Object.keys(this.statusValuesToLabels).sort();
    const sortedKeys = values.map((value) => {
      return keys.find((key) => {
        return this.statusValuesToLabels[Number(key) as TaskStatus] === value;
      });
    });

    return (sortedKeys.filter(Boolean) as string[]).map((key) => {
      const status = Number(key) as TaskStatus;
      return {
        value: key,
        name: this.statusValuesToLabels[status]
      };
    });
  }

  getStatusLabel(status: TaskStatus): string {
    return this.statusValuesToLabels[status];
  }

  restoreStatusGroups(): TasksStatusGroup[] {
    return this.#dashboardStorageService.restoreStatusGroups() ?? this.defaultStatusGroups;
  }

  saveStatusGroups(groups: TasksStatusGroup[]) {
    this.#dashboardStorageService.saveStatusGroups(groups);
  }

  restoreIntervalValue(): number {
    const storedValue = this.#dashboardStorageService.restoreInterval();

    if(storedValue === null) {
      return this.defaultIntervalValue;
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
