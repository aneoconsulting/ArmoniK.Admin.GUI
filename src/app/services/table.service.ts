import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { FieldKey } from '@app/types/data';
import { ListOptions } from '@app/types/options';
import { StorageService } from './storage.service';
import { TableStorageService } from './table-storage.service';
import { TableURLService } from './table-url.service';


/**
 * Service to save and restore table state using the URL and the storage.
 */
@Injectable()
export class TableService {
  private readonly _columnsKey = 'columns';
  private readonly _intervalKey = 'interval';
  private readonly _optionsKey = 'options';
  private readonly _filtersKey = 'filters';

  constructor(
    private _storageService: StorageService,
    private _tableURLService: TableURLService,
    private _tableStorageService: TableStorageService
  ) {}

  saveIntervalValue(tableName: string, value: number): void {
    const storageKey = this._storageService.buildKey(tableName, this._intervalKey);

    this._tableStorageService.save(storageKey, value);
  }

  restoreIntervalValue(tableName: string): number | null {
    const storageKey = this._storageService.buildKey(tableName, this._intervalKey);

    const value =  this._tableStorageService.restore<string>(storageKey, false);

    if (!value) {
      return null;
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue)) {
      return null;
    }

    return numberValue;
  }


  /**
   * Save options to the storage
   */
  saveOptions<T>(tableName: string, options: T): void {
    const storageKey = this._storageService.buildKey(tableName, this._optionsKey);

    this._tableStorageService.save(storageKey, options);
  }

  /**
   * Restore options from the storage
   */
  restoreOptions<T extends object>(tableName: string, defaultOptions: ListOptions<T>): ListOptions<T> {
    const storageKey = this._storageService.buildKey(tableName, this._optionsKey);
    const storageData = this._tableStorageService.restore<T>(storageKey) as ListOptions<T> | null;

    function convertValueToNumber(value: string | null): number | null {
      if (!value) {
        return null;
      }

      const numberValue = Number(value);

      if (Number.isNaN(numberValue)) {
        return null;
      }

      return numberValue;
    }

    const options: ListOptions<T> = {
      pageIndex: convertValueToNumber(this._tableURLService.getQueryParamsOptions('pageIndex')) ?? storageData?.pageIndex ?? defaultOptions?.pageIndex,
      pageSize: convertValueToNumber(this._tableURLService.getQueryParamsOptions('pageSize')) ?? storageData?.pageSize ?? defaultOptions?.pageSize,
      sort: {
        active: this._tableURLService.getQueryParamsOptions<FieldKey<T>>('sortField') ?? storageData?.sort.active ?? defaultOptions?.sort.active,
        direction: this._tableURLService.getQueryParamsOptions<SortDirection>('sortDirection') ?? storageData?.sort.direction ?? defaultOptions?.sort.direction,
      },
    };

    return options;
  }

  /**
   * Restore filters from the URL and then from the storage
   */
  restoreFilters<T>(tableName:string): T | null {
    const storageKey = this._storageService.buildKey(tableName, this._filtersKey);

    const queryParams = this._tableURLService.getQueryParams<T>(this._filtersKey) as T;

    if (queryParams) {
      this.saveFilters(tableName, queryParams);
      return queryParams;
    }

    const storageData = this._tableStorageService.restore<T>(storageKey) as T;

    return storageData;
  }

  /**
   * Restore filters from the URL and then from the storage
   */
  saveFilters(tableName: string, filters: unknown) {
    const storageKey = this._storageService.buildKey(tableName, this._filtersKey);

    this._tableStorageService.save(storageKey, filters);
  }

  resetFilters(tableName: string): void {
    const storageKey = this._storageService.buildKey(tableName, this._filtersKey);

    this._tableStorageService.remove(storageKey);
  }


  /**
   * Save columns to the local storage
   */
  saveColumns(tableName: string, columns: string[]): void {
    const key = this._storageService.buildKey(tableName, this._columnsKey);
    this._tableStorageService.save(key, columns);
  }

  /**
   * Restore columns from the local storage
   */
  restoreColumns<T>(tableName: string): T | null {
    const key = this._storageService.buildKey(tableName, this._columnsKey);

    return this._tableStorageService.restore<T>(key) as T;
  }

  resetColumns(tableName: string): void {
    const key = this._storageService.buildKey(tableName, this._columnsKey);

    this._tableStorageService.remove(key);
  }
}
