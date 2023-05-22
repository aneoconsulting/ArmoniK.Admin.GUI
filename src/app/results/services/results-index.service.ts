import { Injectable } from '@angular/core';
import { ColumnKey } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { AppIndexService } from '@app/types/services';
import { TableService } from '@services/table.service';
import { ResultRaw, ResultRawColumnKey, ResultRawFilter, ResultRawFilterField, ResultRawListOptions } from '../types';

@Injectable()
export class ResultsIndexService implements AppIndexService<ResultRaw> {
  readonly tableName: string = 'results';

  readonly defaultColumns: ResultRawColumnKey[] = ['name', 'actions'];
  readonly availableColumns: ResultRawColumnKey[] = ['name', 'status', 'ownerTaskId', 'createdAt', 'sessionId', 'actions'];

  readonly defaultOptions: ResultRawListOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'asc'
    },
  };

  readonly defaultFilters: ResultRawFilter[] = [];
  readonly availableFiltersFields: ResultRawFilterField[] = [
    {
      field: 'name',
      type: 'text',
    },
    {
      field: 'status',
      // TODO: Create a select filter (maybe with some default options)
      type: 'text',
    },
    {
      field: 'ownerTaskId',
      type: 'text',
    },
    {
      field: 'createdAt',
      type: 'date',
    },
    {
      field: 'sessionId',
      type: 'text',
    },
  ];

  readonly defaultIntervalValue: number = 10;

  constructor(
    private _tableService: TableService,
  ) {}

  generateSharableURL(options: ResultRawListOptions, filters: ResultRawFilter[]): string {
    return this._tableService.generateSharableURL(options, filters);
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this._tableService.saveIntervalValue(this.tableName, value);
  }

  restoreIntervalValue(): number {
    return this._tableService.restoreIntervalValue(this.tableName) ?? this.defaultIntervalValue;
  }

  /**
   * Options
   */

  saveOptions(options: ResultRawListOptions): void {
    this._tableService.saveOptions(this.tableName, options);
  }

  restoreOptions(): ResultRawListOptions {
    const options = this._tableService.restoreOptions<ResultRaw>(this.tableName, this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: ColumnKey<ResultRaw>[]): void {
    this._tableService.saveColumns(this.tableName, columns);
  }

  restoreColumns(): ColumnKey<ResultRaw>[] {
    return this._tableService.restoreColumns<ResultRawColumnKey[]>(this.tableName) ?? this.defaultColumns;
  }

  resetColumns(): ResultRawColumnKey[] {
    this._tableService.resetColumns(this.tableName);

    return this.defaultColumns;
  }

  /**
   * Filters
   */

  saveFilters(filtersFields: ResultRawFilter[]): void {
    this._tableService.saveFilters(this.tableName, filtersFields);
  }

  restoreFilters(): ResultRawFilter[] {
    return this._tableService.restoreFilters<ResultRawFilter[]>(this.tableName) ?? this.defaultFilters;
  }

  resetFilters(): ResultRawFilter[] {
    this._tableService.resetFilters(this.tableName);

    return this.defaultFilters;
  }
}
