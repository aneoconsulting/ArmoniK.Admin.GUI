import { Injectable, inject } from '@angular/core';
import { TableColumn } from '@app/types/column.type';
import { IndexServiceInterface } from '@app/types/services/indexService';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ResultRaw, ResultRawColumnKey, ResultRawListOptions } from '../types';

@Injectable()
export class ResultsIndexService implements IndexServiceInterface<ResultRaw> {
  defaultConfigService = inject(DefaultConfigService);
  tableService = inject(TableService);

  readonly defaultColumns: ResultRawColumnKey[] = this.defaultConfigService.defaultResults.columns;
  readonly defaultLockColumns: boolean = this.defaultConfigService.defaultResults.lockColumns;
  readonly defaultOptions: ResultRawListOptions = this.defaultConfigService.defaultResults.options;
  readonly defaultIntervalValue: number = this.defaultConfigService.defaultResults.interval;

  readonly availableTableColumns: TableColumn<ResultRaw>[] = [
    {
      name: $localize`Name`,
      key: 'name',
      sortable: true
    },
    {
      name: $localize`Status`,
      key: 'status',
      type: 'status',
      sortable: true
    },
    {
      name: $localize`Owner Task ID`,
      key: 'ownerTaskId',
      type: 'link',
      sortable: true,
      link: '/tasks',
    },
    {
      name: $localize`Created By`,
      key: 'createdBy',
      sortable: true,
    },
    {
      name: $localize`Created at`,
      key: 'createdAt',
      type: 'date',
      sortable: true
    },
    {
      name: $localize`Session ID`,
      key: 'sessionId',
      type: 'link',
      sortable: true,
      link: '/sessions',
    },
    {
      name: $localize`Result ID`,
      key: 'resultId',
      type: 'link',
      sortable: true,
      link: '/results',
    },
    {
      name: $localize`Size`,
      key: 'size',
      sortable: true
    },
    {
      name: $localize`Manual Deletion`,
      key: 'manualDeletion',
      sortable: true,
    },
    {
      name: $localize`Opaque ID`,
      key: 'opaqueId',
      type: 'byte-array',
      sortable: false,
    }
  ];

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.tableService.saveIntervalValue('results-interval', value);
  }

  restoreIntervalValue(): number {
    return this.tableService.restoreIntervalValue('results-interval') ?? this.defaultIntervalValue;
  }

  /**
   * Lock columns
   */

  saveLockColumns(value: boolean): void {
    this.tableService.saveLockColumns('results-lock-columns', value);
  }

  restoreLockColumns(): boolean {
    return this.tableService.restoreLockColumns('results-lock-columns') ?? this.defaultLockColumns;
  }

  /**
   * Options
   */

  saveOptions(options: ResultRawListOptions): void {
    this.tableService.saveOptions('results-options', options);
  }

  restoreOptions(): ResultRawListOptions {
    const options = this.tableService.restoreOptions<ResultRaw>('results-options', this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: ResultRawColumnKey[]): void {
    this.tableService.saveColumns('results-columns', columns);
  }

  restoreColumns(): ResultRawColumnKey[] {
    return this.tableService.restoreColumns<ResultRawColumnKey[]>('results-columns') ?? this.defaultColumns;
  }

  resetColumns(): ResultRawColumnKey[] {
    this.tableService.resetColumns('results-columns');

    return Array.from(this.defaultColumns);
  }
}
