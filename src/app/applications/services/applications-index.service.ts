import { Injectable } from '@angular/core';
import { AppIndexService } from '@app/types/services';
import { TableService } from '@services/table.service';
import { ApplicationRaw, ApplicationRawColumn, ApplicationRawFilter, ApplicationRawFilterField, ApplicationRawListOptions } from '../types';

@Injectable()
export class ApplicationsIndexService implements AppIndexService<ApplicationRaw> {
  readonly tableName: string = 'applications';

  readonly defaultColumns: ApplicationRawColumn[] = ['name', 'version', 'actions'];
  readonly availableColumns: ApplicationRawColumn[] = ['name', 'namespace', 'service', 'version', 'actions'];

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

  constructor(private _tableService: TableService) {}

  generateSharableURL(options: ApplicationRawListOptions, filters: ApplicationRawFilter[]): string {
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

  saveOptions(options: ApplicationRawListOptions): void {
    this._tableService.saveOptions(this.tableName, options);
  }

  restoreOptions(): ApplicationRawListOptions {
    const options = this._tableService.restoreOptions<ApplicationRaw>(this.tableName, this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: ApplicationRawColumn[]): void {
    this._tableService.saveColumns(this.tableName, columns);
  }

  restoreColumns(): ApplicationRawColumn[] {
    return this._tableService.restoreColumns<ApplicationRawColumn[]>(this.tableName) ?? this.defaultColumns;
  }

  resetColumns(): ApplicationRawColumn[] {
    this._tableService.resetColumns(this.tableName);

    return this.defaultColumns;
  }

  /**
   * Filters
   */

  saveFilters(filters: ApplicationRawFilter[]): void {
    this._tableService.saveFilters(this.tableName, filters);
  }

  restoreFilters(): ApplicationRawFilter[] {
    return this._tableService.restoreFilters<ApplicationRawFilter[]>(this.tableName) ?? this.defaultFilters;
  }

  resetFilters(): ApplicationRawFilter[] {
    this._tableService.resetFilters(this.tableName);

    return this.defaultFilters;
  }
}