import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { TasksStatusesService } from '@app/tasks/services/tasks-status.service';
import { DefaultConfigService } from '@services/default-config.service';
import { DashboardStorageService } from './dashboard-storage.service';
import { Line } from '../types';

@Injectable()
export class DashboardIndexService {
  #defaultConfigService = inject(DefaultConfigService);
  #dashboardStorageService = inject(DashboardStorageService);
  #tasksStatusesService = inject(TasksStatusesService);

  readonly defaultLines: Line[] = this.#defaultConfigService.defaultDashboardLines;

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

  restoreLines(): Line[] {
    return this.#dashboardStorageService.restoreLines() ?? this.defaultLines;
  }

  saveLines(lines: Line[]): void {
    this.#dashboardStorageService.saveLines(lines);
  }
}
