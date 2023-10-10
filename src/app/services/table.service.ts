import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Scope } from '@app/types/config';
import { FieldKey } from '@app/types/data';
import { FilterDefinition } from '@app/types/filter-definition';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { TableStorageService } from './table-storage.service';
import { TableURLService } from './table-url.service';


/**
 * Service to save and restore table state using the URL and the storage.
 */
@Injectable()
export class TableService {

  constructor(
    private _tableURLService: TableURLService,
    private _tableStorageService: TableStorageService
  ) {}

  saveIntervalValue(key: `${Scope}-interval`, value: number): void {
    this._tableStorageService.save(key, value);
  }

  restoreIntervalValue(key: `${Scope}-interval`): number | null {
    const value =  this._tableStorageService.restore<string>(key, false);

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
  saveOptions<T>(key: `${Scope}-options`, options: T): void {
    this._tableStorageService.save(key, options);
  }

  /**
   * Restore options from the storage
   */
  restoreOptions<T extends object>(key: `${Scope}-options`, defaultOptions: ListOptions<T>): ListOptions<T> {
    const storageData = this._tableStorageService.restore<T>(key) as ListOptions<T> | null;

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
  restoreFilters<T extends number, U extends number | null>(key: `${Scope}-filters`, filtersDefinitions: FilterDefinition<T, U>[]): FiltersOr<T, U> | null {

    const queryParams = this._tableURLService.getQueryParamsFilters<T, U>(filtersDefinitions);

    if (queryParams.length) {
      this.saveFilters(key, queryParams);
      return queryParams;
    }


    const storageData = this._tableStorageService.restore<FiltersOr<T, U>>(key) as FiltersOr<T, U> | null;

    return storageData;
  }

  /**
   * Restore filters from the URL and then from the storage
   */
  saveFilters(key: `${Scope}-filters`, filters: unknown) {
    this._tableStorageService.save(key, filters);
  }

  resetFilters(key: `${Scope}-filters`): void {
    this._tableStorageService.remove(key);
  }

  /**
   * Save columns to the local storage
   */
  saveColumns(key: `${Scope}-columns`, columns: string[]): void {
    this._tableStorageService.save(key, columns);
  }

  /**
   * Restore columns from the local storage
   */
  restoreColumns<T>(key: `${Scope}-columns`): T | null {
    return this._tableStorageService.restore<T>(key) as T;
  }

  resetColumns(key: `${Scope}-columns`): void {
    this._tableStorageService.remove(key);
  }

  /**
   * Save view in logs to the local storage
   */
  saveViewInLogs(key: 'tasks-view-in-logs', serviceIcon: string, serviceName: string, urlTemplate: string): void {
    this._tableStorageService.save(key, { serviceIcon, serviceName, urlTemplate });
  }

  restoreViewInLogs(key: 'tasks-view-in-logs'): { serviceIcon: string, serviceName: string, urlTemplate: string } | null {
    return this._tableStorageService.restore<{ serviceIcon: string, serviceName: string, urlTemplate: string }>(key) as { serviceIcon: string, serviceName: string, urlTemplate: string } | null;
  }
}
