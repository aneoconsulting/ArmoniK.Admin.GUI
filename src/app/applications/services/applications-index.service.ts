import { Injectable, inject } from '@angular/core';
import { TableService } from '@services/table.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFilter, ApplicationRawFilterField, ApplicationRawListOptions } from '../types';

@Injectable()
// export class ApplicationsIndexService implements AppIndexService<ApplicationRaw> {
export class ApplicationsIndexService {
  readonly tableName: string = 'applications';

  readonly defaultColumns: ApplicationRawColumnKey[] = ['name', 'version', 'count'];
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

  readonly defaultOptions: ApplicationRawListOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'asc'
    },
  };

  readonly defaultFilters: ApplicationRawFilter[] = [];
  readonly availableFiltersFields: ApplicationRawFilterField[] = [
    {
      field: 'name',
      type: 'text',
    },
    {
      field: 'namespace',
      type: 'text',
    },
    {
      field: 'service',
      type: 'text',
    },
    {
      field: 'version',
      type: 'text',
    }
  ];

  readonly defaultIntervalValue = 10;

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
    this.#tableService.saveIntervalValue(this.tableName, value);
  }

  restoreIntervalValue(): number {
    return this.#tableService.restoreIntervalValue(this.tableName) ?? this.defaultIntervalValue;
  }

  /**
   * Options
   */

  saveOptions(options: ApplicationRawListOptions): void {
    this.#tableService.saveOptions(this.tableName, options);
  }

  restoreOptions(): ApplicationRawListOptions {
    const options = this.#tableService.restoreOptions<ApplicationRaw>(this.tableName, this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: ApplicationRawColumnKey[]): void {
    this.#tableService.saveColumns(this.tableName, columns);
  }

  restoreColumns(): ApplicationRawColumnKey[] {
    return this.#tableService.restoreColumns<ApplicationRawColumnKey[]>(this.tableName) ?? this.defaultColumns;
  }

  resetColumns(): ApplicationRawColumnKey[] {
    this.#tableService.resetColumns(this.tableName);

    return Array.from(this.defaultColumns);
  }

  /**
   * Filters
   */

  saveFilters(filters: ApplicationRawFilter[]): void {
    this.#tableService.saveFilters(this.tableName, filters);
  }

  restoreFilters(): ApplicationRawFilter[] {
    // TODO: rework filters
    return this.#tableService.restoreFilters<ApplicationRawFilter[]>(this.tableName) ?? this.defaultFilters;
  }

  resetFilters(): ApplicationRawFilter[] {
    this.#tableService.resetFilters(this.tableName);

    return this.defaultFilters;
  }
}
