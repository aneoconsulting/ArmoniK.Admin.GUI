import { Injectable, inject } from '@angular/core';
import { AppIndexService } from '@app/types/services';
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

  #tableSErvice = inject(TableService);

  columnToLabel(column: ApplicationRawColumnKey): string {
    return this.columnsLabels[column];
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.#tableSErvice.saveIntervalValue(this.tableName, value);
  }

  restoreIntervalValue(): number {
    return this.#tableSErvice.restoreIntervalValue(this.tableName) ?? this.defaultIntervalValue;
  }

  /**
   * Options
   */

  saveOptions(options: ApplicationRawListOptions): void {
    this.#tableSErvice.saveOptions(this.tableName, options);
  }

  restoreOptions(): ApplicationRawListOptions {
    const options = this.#tableSErvice.restoreOptions<ApplicationRaw>(this.tableName, this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: ApplicationRawColumnKey[]): void {
    this.#tableSErvice.saveColumns(this.tableName, columns);
  }

  restoreColumns(): ApplicationRawColumnKey[] {
    return this.#tableSErvice.restoreColumns<ApplicationRawColumnKey[]>(this.tableName) ?? this.defaultColumns;
  }

  resetColumns(): ApplicationRawColumnKey[] {
    this.#tableSErvice.resetColumns(this.tableName);

    return this.defaultColumns;
  }

  /**
   * Filters
   */

  saveFilters(filters: ApplicationRawFilter[]): void {
    this.#tableSErvice.saveFilters(this.tableName, filters);
  }

  restoreFilters(): ApplicationRawFilter[] {
    return this.#tableSErvice.restoreFilters<ApplicationRawFilter[]>(this.tableName) ?? this.defaultFilters;
  }

  resetFilters(): ApplicationRawFilter[] {
    this.#tableSErvice.resetFilters(this.tableName);

    return this.defaultFilters;
  }
}
