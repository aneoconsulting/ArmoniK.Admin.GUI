import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { StorageService } from '@services/storage.service';
import { DashboardStorageService } from './dashboard-storage.service';
import { TasksStatusGroup } from '../types';

@Injectable()
export class DashboardIndexService {
  readonly statusValuesToLabels: Record<TaskStatus, string> = {
    [TaskStatus.TASK_STATUS_COMPLETED]: 'Finished',
    [TaskStatus.TASK_STATUS_PROCESSING]: 'Processing',
    [TaskStatus.TASK_STATUS_PROCESSED]: 'Processed',
    [TaskStatus.TASK_STATUS_CANCELLING]: 'Cancelling',
    [TaskStatus.TASK_STATUS_CANCELLED]: 'Cancelled',
    [TaskStatus.TASK_STATUS_DISPATCHED]: 'Dispatched',
    [TaskStatus.TASK_STATUS_CREATING]: 'Creating',
    [TaskStatus.TASK_STATUS_SUBMITTED]: 'Submitted',
    [TaskStatus.TASK_STATUS_ERROR]: 'Error',
    [TaskStatus.TASK_STATUS_TIMEOUT]: 'Timeout',
    [TaskStatus.TASK_STATUS_UNSPECIFIED]: 'Unspecified',
  };

  readonly defaultCountersGroup: TasksStatusGroup[] = [
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

  getStatusLabel(status: TaskStatus): string {
    return this.statusValuesToLabels[status];
  }


  // TODO: Rename method
  restoreCountersGroup(): TasksStatusGroup[] {
    return this.defaultCountersGroup;
  }
  // TODO: Must create a save method

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
