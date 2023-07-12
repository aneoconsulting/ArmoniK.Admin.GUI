import { Injectable, inject } from '@angular/core';
import { TaskStatusColored } from '@app/types/dialog';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

type TableTasksByStatus = 'applications' | 'sessions';

@Injectable()
export class TasksByStatusService {
  #key = 'tasks-by-status';

  #defaultConfigService = inject(DefaultConfigService);
  #storageService = inject(StorageService);

  readonly defaultStatuses: TaskStatusColored[] = this.#defaultConfigService.defaultTasksByStatus;

  restoreStatuses(table: TableTasksByStatus): TaskStatusColored[] {
    return this.#storageService.getItem<TaskStatusColored[]>(`${this.#key}-${table}`, true) as TaskStatusColored[] | null ?? this.defaultStatuses;
  }

  saveStatuses(table: TableTasksByStatus, statuses: TaskStatusColored[]): void {
    this.#storageService.setItem(`${this.#key}-${table}`, statuses);
  }
}
