import { Injectable } from '@angular/core';
import { TableService } from '@services/table.service';
import { Column, Filter } from '@app/types/data';
import { AppIndexService } from '@app/types/services';
import { ResultRaw, ResultRawColumn, ResultRawFilter, ResultRawFilterField, ResultRawListOptions } from '../types';

@Injectable()
export class ResultsIndexService implements AppIndexService<ResultRaw> {
  readonly tableName: string = 'results';

  readonly defaultColumns: ResultRawColumn[] = ['name', 'actions'];
  readonly availableColumns: ResultRawColumn[] = ['name', 'status', 'ownerTaskId', 'createdAt', 'sessionId', 'actions'];

  readonly defaultOptions: ResultRawListOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'asc'
    },
  };

  readonly defaultFilters: Filter<ResultRaw>[];
  readonly availableFiltersFields: ResultRawFilterField[];

  readonly defaultIntervalValue: number = 10;

  constructor(
    private _tableService: TableService,
  ) {}

  // TODO: Create function in table service
  generateSharableURL(options: ResultRawListOptions): string {
    return '/results';
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

  saveColumns(columns: Column<ResultRaw>[]): void {
    this._tableService.saveColumns(this.tableName, columns);
  }

  restoreColumns(): Column<ResultRaw>[] {
    return this._tableService.restoreColumns<ResultRawColumn[]>(this.tableName) ?? this.defaultColumns;
  }

  resetColumns(): ResultRawColumn[] {
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
