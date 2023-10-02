import { Injectable, inject } from '@angular/core';
import { TaskStatusColored } from '@app/types/dialog';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

type TableTasksByStatus = 'applications' | 'sessions' | 'partitions';

@Injectable()
export class TasksByStatusService {
  readonly #key = 'tasks-by-status';

  #defaultConfigService = inject(DefaultConfigService);
  #storageService = inject(StorageService);

  readonly defaultStatuses: TaskStatusColored[] = this.#defaultConfigService.defaultTasksByStatus;
  /**
   * 
   * @param table 
   * @returns An array of TaskStatusColored objects
   */
  restoreStatuses(table: TableTasksByStatus): TaskStatusColored[] {
    return this.#storageService.getItem<TaskStatusColored[]>(`${table}-${this.#key}`, true) as TaskStatusColored[] | null ?? this.defaultStatuses;
  }
  /**
   * Save colors corresponding to tasks statuses for applications, sessions or partitions
   * @param table a type TableTasksByStatus object 
   * @param statuses array of TaskStatusColored objects
   */
  saveStatuses(table: TableTasksByStatus, statuses: TaskStatusColored[]): void {
    this.#storageService.setItem(`${table}-${this.#key}`, statuses);
  }
}
