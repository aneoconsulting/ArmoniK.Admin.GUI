import { Injectable, inject } from '@angular/core';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawListOptions } from '../types';

@Injectable()
// export class ApplicationsIndexService implements AppIndexService<ApplicationRaw> {
export class ApplicationsIndexService {
  #defaultConfigService = inject(DefaultConfigService);

  readonly defaultColumns: ApplicationRawColumnKey[] = this.#defaultConfigService.defaultApplications.columns;
  readonly availableColumns: ApplicationRawColumnKey[] = ['name', 'namespace', 'service', 'version', 'actions', 'count'];

  // TODO: Add it to AppIndexService and to every index service
  readonly columnsLabels: Record<ApplicationRawColumnKey, string> = {
    name: $localize`Name`,
    namespace: $localize`Namespace`,
    service: $localize`Service`,
    version: $localize`Version`,
    count: $localize`Tasks by Status`,
    actions: $localize`Actions`,
  };

  readonly defaultOptions: ApplicationRawListOptions = this.#defaultConfigService.defaultApplications.options;

  readonly defaultIntervalValue = this.#defaultConfigService.defaultApplications.interval;
  readonly defaultLockColumnValue = this.#defaultConfigService.defaultApplications.lockColumns;

  #tableService = inject(TableService);

  columnToLabel(column: ApplicationRawColumnKey): string {
    return this.columnsLabels[column];
  }

  /**
   * Table
   */
  isActionsColumn(column: ApplicationRawColumnKey): boolean {
    return column === 'actions';
  }

  isCountColumn(column: ApplicationRawColumnKey): boolean {
    return column === 'count';
  }

  isSimpleColumn(column: ApplicationRawColumnKey): boolean {
    return !this.isActionsColumn(column) && !this.isCountColumn(column);
  }

  isNotSortableColumn(column: ApplicationRawColumnKey): boolean {
    return this.isActionsColumn(column) || this.isCountColumn(column);
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.#tableService.saveIntervalValue('applications-interval', value);
  }

  restoreIntervalValue(): number {
    return this.#tableService.restoreIntervalValue('applications-interval') ?? this.defaultIntervalValue;
  }

  /**
   * Lock columns
   */

  saveLockColumns(value: boolean): void {
    this.#tableService.saveLockColumns('applications-lock-columns', value);
  }

  restoreLockColumns(): boolean {
    return this.#tableService.restoreLockColumns('applications-lock-columns') ?? this.defaultLockColumnValue;
  }

  /**
   * Options
   */

  saveOptions(options: ApplicationRawListOptions): void {
    this.#tableService.saveOptions('applications-options', options);
  }

  restoreOptions(): ApplicationRawListOptions {
    const options = this.#tableService.restoreOptions<ApplicationRaw>('applications-options', this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: ApplicationRawColumnKey[]): void {
    this.#tableService.saveColumns('applications-columns', columns);
  }

  restoreColumns(): ApplicationRawColumnKey[] {
    return this.#tableService.restoreColumns<ApplicationRawColumnKey[]>('applications-columns') ?? this.defaultColumns;
  }

  resetColumns(): ApplicationRawColumnKey[] {
    this.#tableService.resetColumns('applications-columns');

    return Array.from(this.defaultColumns);
  }
}
