import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { TaskOptions } from '@app/tasks/types';
import { CustomScope, Scope } from '@app/types/config';
import { DataRaw, FieldKey } from '@app/types/data';
import { FilterDefinition } from '@app/types/filter-definition';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { GroupConditions } from '@app/types/groups';
import { ListOptions } from '@app/types/options';
import { TableStorageService } from './table-storage.service';
import { TableURLService } from './table-url.service';


/**
 * Service to save and restore table state using the URL and the storage.
 */
@Injectable()
export class TableService {

  constructor(
    private readonly tableURLService: TableURLService,
    private readonly tableStorageService: TableStorageService
  ) {}

  saveIntervalValue(key: `${Scope}-interval`, value: number): void {
    this.tableStorageService.save(key, value);
  }

  restoreIntervalValue(key: `${Scope}-interval`): number | null {
    const value =  this.tableStorageService.restore<string>(key, false);

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
    this.tableStorageService.save(key, options);
  }

  /**
   * Restore options from the storage
   */
  restoreOptions<T extends DataRaw, O extends TaskOptions | null = null>(key: `${Scope}-options`, defaultOptions: ListOptions<T, O>): ListOptions<T, O> {
    const storageData = this.tableStorageService.restore<T>(key) as ListOptions<T> | null;

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

    const options: ListOptions<T, O> = {
      pageIndex: convertValueToNumber(this.tableURLService.getQueryParamsOptions('pageIndex')) ?? storageData?.pageIndex ?? defaultOptions?.pageIndex,
      pageSize: convertValueToNumber(this.tableURLService.getQueryParamsOptions('pageSize')) ?? storageData?.pageSize ?? defaultOptions?.pageSize,
      sort: {
        active: this.tableURLService.getQueryParamsOptions<FieldKey<T & O>>('sortField') ?? storageData?.sort.active ?? defaultOptions?.sort.active,
        direction: this.tableURLService.getQueryParamsOptions<SortDirection>('sortDirection') ?? storageData?.sort.direction ?? defaultOptions?.sort.direction,
      },
    };

    return options;
  }

  /**
   * Restore filters from the URL and then from the storage
   */
  restoreFilters<T extends number, U extends number | null>(key: `${Scope}-filters`, filtersDefinitions: FilterDefinition<T, U>[]): FiltersOr<T, U> | null {
    const queryParams = this.tableURLService.getQueryParamsFilters<T, U>(filtersDefinitions);

    if (queryParams.length !== 0) {
      return queryParams;
    }

    console.log('getting storage', key);

    const storageData = this.tableStorageService.restore<FiltersOr<T, U>>(key) as FiltersOr<T, U> | null;

    console.log(storageData);

    return storageData;
  }

  /**
   * Restore filters from the URL and then from the storage
   */
  saveFilters(key: `${Scope}-filters`, filters: unknown) {
    this.tableStorageService.save(key, filters);
  }

  resetFilters(key: `${Scope}-filters`): void {
    this.tableStorageService.remove(key);
  }

  /**
   * Save show filters to the storage
   */
  saveShowFilters(key: `${Scope}-show-filters`, showFilters: boolean): void {
    this.tableStorageService.save(key, showFilters);
  }

  /**
   * Restore show filters from the storage
   */
  restoreShowFilters(key: `${Scope}-show-filters`): boolean {
    return this.tableStorageService.restore(key) as boolean;
  }

  /**
   * Save groups for a given table.
   */
  saveGroups<F extends FiltersEnums, O extends FiltersOptionsEnums | null>(key: `${Scope}-groups`, groups: GroupConditions<F, O>[]) {
    this.tableStorageService.save(key, groups);
  }

  /**
   * Retrieve groups for a given table.
   */
  restoreGroups<F extends FiltersEnums, O extends FiltersOptionsEnums | null>(key: `${Scope}-groups`): GroupConditions<F, O>[] {
    return (this.tableStorageService.restore(key) ?? []) as GroupConditions<F, O>[];
  }

  /**
   * Reset groups for a given table.
   */
  resetGroups(key: `${Scope}-groups`) {
    return this.tableStorageService.remove(key);
  }

  /**
   * Save columns to the local storage
   */
  saveColumns(key: `${Scope}-columns` | `${CustomScope}-custom-columns`, columns: string[]): void {
    this.tableStorageService.save(key, columns);
  }

  /**
   * Restore columns from the local storage
   */
  restoreColumns<T>(key: `${Scope}-columns` | `${CustomScope}-custom-columns`): T | null {
    return this.tableStorageService.restore<T>(key) as T;
  }

  resetColumns(key: `${Scope}-columns`): void {
    this.tableStorageService.remove(key);
  }

  saveLockColumns(key: `${Scope}-lock-columns`, lockColumns: boolean): void {
    this.tableStorageService.save(key, lockColumns);
  }

  restoreLockColumns(key: `${Scope}-lock-columns`): boolean {
    return this.tableStorageService.restore(key) as boolean;
  }

  /**
   * Save view in logs to the local storage
   */
  saveViewInLogs(key: 'tasks-view-in-logs', serviceIcon: string, serviceName: string, urlTemplate: string): void {
    this.tableStorageService.save(key, { serviceIcon, serviceName, urlTemplate });
  }

  restoreViewInLogs(key: 'tasks-view-in-logs'): { serviceIcon: string, serviceName: string, urlTemplate: string } | null {
    return this.tableStorageService.restore<{ serviceIcon: string, serviceName: string, urlTemplate: string }>(key) as { serviceIcon: string, serviceName: string, urlTemplate: string } | null;
  }
}
