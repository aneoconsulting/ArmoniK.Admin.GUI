import { Injectable, inject } from '@angular/core';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ResultsStatusesService } from './results-statuses.service';
import { ResultRaw, ResultRawColumnKey, ResultRawListOptions } from '../types';

@Injectable()
export class ResultsIndexService {
  #defaultConfigService = inject(DefaultConfigService);
  #resultsStatusesService = inject(ResultsStatusesService);

  readonly defaultColumns: ResultRawColumnKey[] = this.#defaultConfigService.defaultResults.columns;
  readonly availableColumns: ResultRawColumnKey[] = ['name', 'status', 'ownerTaskId', 'createdAt', 'sessionId', 'actions'];

  readonly dateColumns: ResultRawColumnKey[] = ['createdAt'];

  readonly columnsLabels: Record<ResultRawColumnKey, string> = {
    name: $localize`Name`,
    status: $localize`Status`,
    ownerTaskId: $localize`Owner Task ID`,
    createdAt: $localize`Created at`,
    sessionId: $localize`Session ID`,
    actions: $localize`Actions`,
    completedAt: $localize`Completed at`,
    resultId: $localize`Result ID`,
  };

  readonly defaultOptions: ResultRawListOptions = this.#defaultConfigService.defaultResults.options;

  readonly defaultIntervalValue: number = this.#defaultConfigService.defaultResults.interval;

  #tableService = inject(TableService);

  columnToLabel(column: ResultRawColumnKey): string {
    return this.columnsLabels[column];
  }

  /**
   * Table
   */

  isSessionIdColumn(column: ResultRawColumnKey): boolean {
    return column === 'sessionId';
  }

  isActionsColumn(column: ResultRawColumnKey): boolean {
    return column === 'actions';
  }

  isStatusColumn(column: ResultRawColumnKey): boolean {
    return column === 'status';
  }

  isDateColumn(column: ResultRawColumnKey): boolean {
    return this.dateColumns.includes(column);
  }

  isNotSortableColumn(column: ResultRawColumnKey): boolean {
    return this.isActionsColumn(column);
  }

  isSimpleColumn(column: ResultRawColumnKey): boolean {
    return !this.isActionsColumn(column) && !this.isStatusColumn(column) && !this.isDateColumn(column) && !this.isSessionIdColumn(column);
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.#tableService.saveIntervalValue('results-interval', value);
  }

  restoreIntervalValue(): number {
    return this.#tableService.restoreIntervalValue('results-interval') ?? this.defaultIntervalValue;
  }

  /**
   * Options
   */

  saveOptions(options: ResultRawListOptions): void {
    this.#tableService.saveOptions('results-options', options);
  }

  restoreOptions(): ResultRawListOptions {
    const options = this.#tableService.restoreOptions<ResultRaw>('results-options', this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: ResultRawColumnKey[]): void {
    this.#tableService.saveColumns('results-columns', columns);
  }

  restoreColumns(): ResultRawColumnKey[] {
    return this.#tableService.restoreColumns<ResultRawColumnKey[]>('results-columns') ?? this.defaultColumns;
  }

  resetColumns(): ResultRawColumnKey[] {
    this.#tableService.resetColumns('results-columns');

    return Array.from(this.defaultColumns);
  }
}
