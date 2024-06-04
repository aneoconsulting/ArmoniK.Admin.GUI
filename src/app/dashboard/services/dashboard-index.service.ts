import { Injectable, inject } from '@angular/core';
import { DefaultConfigService } from '@services/default-config.service';
import { DashboardStorageService } from './dashboard-storage.service';
import { Line } from '../types';

@Injectable()
export class DashboardIndexService {
  #defaultConfigService = inject(DefaultConfigService);
  #dashboardStorageService = inject(DashboardStorageService);

  readonly defaultLines: Line[] = this.#defaultConfigService.defaultDashboardLines;
  readonly defaultSplitLines: number = this.#defaultConfigService.defaultDashboardSplitLines;

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
