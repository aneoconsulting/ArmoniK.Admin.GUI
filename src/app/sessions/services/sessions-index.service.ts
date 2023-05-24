import { Injectable, inject } from '@angular/core';
import { AppIndexService } from '@app/types/services';
import { TableService } from '@services/table.service';
import { SessionRaw, SessionRawColumnKey, SessionRawFilter, SessionRawFilterField, SessionRawListOptions } from '../types';

@Injectable()
export class SessionsIndexService implements AppIndexService<SessionRaw> {
  readonly tableName: string = 'sessions';

  readonly defaultColumns: SessionRawColumnKey[] = ['sessionId', 'actions'];
  // TODO: Add columns (when SessionRaw is merged)
  readonly availableColumns: SessionRawColumnKey[] = ['sessionId', 'status', 'applicationName', 'applicationVersion', 'canceledAt', 'createdAt', 'options', 'actions'];

  readonly columnsLabels: Record<SessionRawColumnKey, string> = {
    sessionId: $localize`Session ID`,
    status: $localize`Status`,
    applicationName: $localize`Application Name`,
    applicationVersion: $localize`Application Version`,
    canceledAt: $localize`Canceled at`,
    createdAt: $localize`Created at`,
    options: $localize`Options`,
    partitionsIds: $localize`Partitions IDs`,
    startedAt: $localize`Started at`,
    actions: $localize`Actions`,
  };

  readonly defaultOptions: SessionRawListOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'sessionId',
      direction: 'asc'
    },
  };

  readonly defaultFilters: SessionRawFilter[] = [];
  readonly availableFiltersFields: SessionRawFilterField[] = [
    // TODO: Add filters (when SessionRaw is merged)
    {
      field: 'sessionId',
      type: 'text',
    }
  ];

  readonly defaultIntervalValue: number = 10;

  #tableService = inject(TableService);

  columnToLabel(column: SessionRawColumnKey): string {
    return this.columnsLabels[column];
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.#tableService.saveIntervalValue(this.tableName, value);
  }

  restoreIntervalValue(): number {
    return this.#tableService.restoreIntervalValue(this.tableName) ?? this.defaultIntervalValue;
  }

  /**
   * Options
   */

  saveOptions(options: SessionRawListOptions): void {
    this.#tableService.saveOptions(this.tableName, options);
  }

  restoreOptions(): SessionRawListOptions {
    const options = this.#tableService.restoreOptions<SessionRaw>(this.tableName, this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: SessionRawColumnKey[]): void {
    this.#tableService.saveColumns(this.tableName, columns);
  }

  restoreColumns(): SessionRawColumnKey[] {
    return this.#tableService.restoreColumns<SessionRawColumnKey[]>(this.tableName) ?? this.defaultColumns;
  }

  resetColumns(): SessionRawColumnKey[] {
    this.#tableService.resetColumns(this.tableName);

    return this.defaultColumns;
  }

  /**
   * Filters
   */

  saveFilters(filters: SessionRawFilter[]): void {
    this.#tableService.saveFilters(this.tableName, filters);
  }

  restoreFilters(): SessionRawFilter[] {
    return this.#tableService.restoreFilters<SessionRawFilter[]>(this.tableName) ?? this.defaultFilters;
  }

  resetFilters(): SessionRawFilter[] {
    this.#tableService.resetFilters(this.tableName);

    return this.defaultFilters;
  }
}
