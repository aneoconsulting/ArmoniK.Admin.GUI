import { Injectable, inject } from '@angular/core';
import { DefaultConfigService } from '@services/default-config.service';
import { DashboardStorageService } from './dashboard-storage.service';
import { Line } from '../types';

@Injectable()
export class DashboardIndexService {
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly dashboardStorageService = inject(DashboardStorageService);

  private readonly defaultLines: Line[] = this.defaultConfigService.defaultDashboardLines;
  private readonly defaultSplitLines: number = this.defaultConfigService.defaultDashboardSplitLines;

  addLine<L extends Line>(line: L): number | void {
    const lines = this.restoreLines();
    lines.push(line);
    this.saveLines(lines);
  }

  restoreLines(): Line[] {
    return this.dashboardStorageService.restoreLines() ?? this.defaultLines;
  }

  saveLines(lines: Line[]): void {
    this.dashboardStorageService.saveLines(lines);
  }

  restoreSplitLines(): number {
    return this.dashboardStorageService.restoreSplitLines() ?? this.defaultSplitLines;
  }

  saveSplitLines(columns: number): void {
    this.dashboardStorageService.saveSplitLines(columns);
  }
}
