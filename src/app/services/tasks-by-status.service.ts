import { Injectable, inject } from '@angular/core';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

export type TableTasksByStatus = 'applications' | 'sessions' | 'partitions';

@Injectable()
export class TasksByStatusService {
  readonly #key = 'tasks-by-status';

  #defaultConfigService = inject(DefaultConfigService);
  #storageService = inject(StorageService);

  readonly defaultStatuses: TasksStatusesGroup[] = this.#defaultConfigService.defaultTasksByStatus;
  restoreStatuses(table: TableTasksByStatus): TasksStatusesGroup[] {
    return this.#storageService.getItem<TasksStatusesGroup[]>(`${table}-${this.#key}`, true) as TasksStatusesGroup[] | null ?? this.defaultStatuses;
  }
  /**
   * Save colors corresponding to tasks statuses for applications, sessions or partitions
   * @param table a type TableTasksByStatus object 
   * @param statuses array of TaskStatusColored objects
   */
  saveStatuses(table: TableTasksByStatus, statuses: TasksStatusesGroup[]): void {
    this.#storageService.setItem(`${table}-${this.#key}`, statuses);
  }
}
