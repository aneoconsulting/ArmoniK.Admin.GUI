import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { TaskStatusColored } from '@app/types/dialog';
import { StorageService } from './storage.service';

type TableTasksByStatus = 'applications' | 'sessions';

@Injectable()
export class TasksByStatusService {
  #key = 'tasks-by-status';

  #storageService = inject(StorageService);

  readonly defaultStatuses: TaskStatusColored[] = [
    {
      status: TaskStatus.TASK_STATUS_COMPLETED,
      color: '#4caf50',
    },
    {
      status: TaskStatus.TASK_STATUS_ERROR,
      color: '#ff0000',
    },
    {
      status: TaskStatus.TASK_STATUS_TIMEOUT,
      color: '#ff6944',
    },
    {
      status: TaskStatus.TASK_STATUS_RETRIED,
      color: '#ff9800',
    },
  ];

  restoreStatuses(table: TableTasksByStatus): TaskStatusColored[] {
    return this.#storageService.getItem<TaskStatusColored[]>(`${this.#key}-${table}`, true) as TaskStatusColored[] | null ?? this.defaultStatuses;
  }

  saveStatuses(table: TableTasksByStatus, statuses: TaskStatusColored[]): void {
    this.#storageService.setItem(`${this.#key}-${table}`, statuses);
  }
}
