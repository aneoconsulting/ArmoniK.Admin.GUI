import { Injectable } from "@angular/core";
import { TableURLService } from "./table-url.service";
import { TableStorageService } from "./table-storage.service";
import { ListRequestOptions } from "../types";

/**
 * Service to save and restore table state using the URL and the storage.
 */
@Injectable()
export class TableService {
  private _columnsKey = 'columns';
  private _optionsKey = 'options';
  private _filtersKey = 'filters';

  constructor(private _storage: Storage, private _tableURLService: TableURLService, private _tableStorageService: TableStorageService) {}

  /**
   * Save options to the storage
   */
  saveOptions<T>(tableName: string, options: T): void {
    const storageKey = this._buildKey(tableName, this._optionsKey);

    this._tableStorageService.save(storageKey, options);
  }

  /**
   * Restore options from the storage
   */
  // TODO: must extend the options interface
  restoreOptions<T>(tableName: string, defaultOptions: ListRequestOptions): T | null {
    const storageKey = this._buildKey(tableName, this._optionsKey);
    const storageData = this._tableStorageService.restore<T>(storageKey) as any;


    const options = {
      pageIndex: this._tableURLService.getQueryParams('pageIndex', false) ?? storageData?.pageIndex ?? defaultOptions?.pageIndex,
      pageSize: this._tableURLService.getQueryParams('pageSize', false) ?? storageData?.pageSize ?? defaultOptions?.pageSize,
      sort: {
        active: this._tableURLService.getQueryParams('sort', false) ?? storageData?.sort ?? defaultOptions?.sort.active,
        direction: this._tableURLService.getQueryParams('order', false) ?? storageData?.order ?? defaultOptions?.sort.direction,
      },
    }

    return options as T
  }

  /**
   * Restore filters from the URL and then from the storage
   */
  restoreFilters<T>(tableName:string): T | null {
    const storageKey = this._buildKey(tableName, this._filtersKey);

    const queryParams = this._tableURLService.getQueryParams<T>(this._filtersKey) as T;
    const storageData = this._tableStorageService.restore<T>(storageKey) as T;

    return queryParams || storageData;
  }

  /**
   * Restore filters from the URL and then from the storage
   */
  saveFilters(tableName: string, filters: unknown) {
    const storageKey = this._buildKey(tableName, this._filtersKey);

    this._tableStorageService.save(storageKey, filters);
  }


  /**
   * Save columns to the local storage
   */
  saveColumns(tableName: string, columns: string[]): void {
    const key = this._buildKey(tableName, this._columnsKey);
    this._storage.setItem(key, JSON.stringify(columns));
  }

  /**
   * Restore columns from the local storage
   */
  restoreColumns<T>(tableName: string): T | null {
    const key = this._buildKey(tableName, this._columnsKey);

    return this._tableStorageService.restore<T>(key) as T;
  }

  /**
   * Build the key to store data in local storage
   */
  private _buildKey(tableName: string, key: string): string {
    return `${tableName}_${key}`;
  }
}
