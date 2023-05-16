import { Injectable } from '@angular/core';
import { AppIndexService } from '@app/types/services';
import { TableService } from '@services/table.service';
import { SessionRaw, SessionRawColumn, SessionRawFilter, SessionRawFilterField, SessionRawListOptions } from '../types';

@Injectable()
export class SessionsIndexService implements AppIndexService<SessionRaw> {
  readonly tableName: string = 'sessions';

  readonly defaultColumns: SessionRawColumn[] = ['sessionId', 'actions'];
  // TODO: Add columns (when SessionRaw is merged)
  readonly availableColumns: SessionRawColumn[] = ['sessionId', 'status', 'applicationName', 'applicationVersion', 'canceledAt', 'createdAt', 'options', 'actions'];

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

  constructor(private _tableService: TableService) {}

  generateSharableURL(options: SessionRawListOptions, filters: SessionRawFilter[]): string {
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

  saveOptions(options: SessionRawListOptions): void {
    this._tableService.saveOptions(this.tableName, options);
  }

  restoreOptions(): SessionRawListOptions {
    const options = this._tableService.restoreOptions<SessionRaw>(this.tableName, this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: SessionRawColumn[]): void {
    this._tableService.saveColumns(this.tableName, columns);
  }

  restoreColumns(): SessionRawColumn[] {
    return this._tableService.restoreColumns<SessionRawColumn[]>(this.tableName) ?? this.defaultColumns;
  }

  resetColumns(): SessionRawColumn[] {
    this._tableService.resetColumns(this.tableName);

    return this.defaultColumns;
  }

  /**
   * Filters
   */

  saveFilters(filters: SessionRawFilter[]): void {
    this._tableService.saveFilters(this.tableName, filters);
  }

  restoreFilters(): SessionRawFilter[] {
    return this._tableService.restoreFilters<SessionRawFilter[]>(this.tableName) ?? this.defaultFilters;
  }

  resetFilters(): SessionRawFilter[] {
    this._tableService.resetFilters(this.tableName);

    return this.defaultFilters;
  }
}
