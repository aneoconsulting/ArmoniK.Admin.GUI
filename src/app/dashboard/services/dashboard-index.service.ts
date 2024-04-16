import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DefaultConfigService } from '@services/default-config.service';
import { DashboardStorageService } from './dashboard-storage.service';
import { Line } from '../types';

@Injectable()
export class DashboardIndexService {
  #defaultConfigService = inject(DefaultConfigService);
  #dashboardStorageService = inject(DashboardStorageService);
  #tasksStatusesService = inject(TasksStatusesService);

  readonly defaultLines: Line[] = this.#defaultConfigService.defaultDashboardLines;
  readonly defaultSplitLines: number = this.#defaultConfigService.defaultDashboardSplitLines;

  // TODO: move to TasksStatusesService
  statuses(): { value: string, name: string }[] {
    const values = Object.values(this.#tasksStatusesService.statuses).sort((a, b) => a.toString().localeCompare(b.toString()));
    const keys = Object.keys(this.#tasksStatusesService.statuses).sort((a, b) => a.toString().localeCompare(b.toString()));
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

  addLine(line: Line): number | void {
    const lines = this.restoreLines();
    lines.push(line);
    this.saveLines(lines);
  }

  restoreLines(): Line[] {
    return this.#dashboardStorageService.restoreLines() ?? this.defaultLines;
  }

  saveLines(lines: Line[]): void {
    this.#dashboardStorageService.saveLines(lines);
  }

  restoreSplitLines(): number {
    return this.#dashboardStorageService.restoreSplitLines() ?? this.defaultSplitLines;
  }

  saveSplitLines(columns: number): void {
    this.#dashboardStorageService.saveSplitLines(columns);
  }
}
