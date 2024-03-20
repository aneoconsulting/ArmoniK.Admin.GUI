import { Injectable, inject } from '@angular/core';
import { TableColumn } from '@app/types/column.type';
import { GenericColumn } from '@app/types/data';
import { IndexServiceGenericInterface } from '@app/types/services/indexService';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { SessionRaw, SessionRawColumnKey, SessionRawListOptions } from '../types';

@Injectable()
export class SessionsIndexService implements IndexServiceGenericInterface<SessionRawColumnKey, SessionRawListOptions> {
  defaultConfigService = inject(DefaultConfigService);
  tableService = inject(TableService);

  readonly defaultColumns: SessionRawColumnKey[] = this.defaultConfigService.defaultSessions.columns;
  readonly defaultLockColumns: boolean = this.defaultConfigService.defaultSessions.lockColumns;
  readonly defaultOptions: SessionRawListOptions = this.defaultConfigService.defaultSessions.options;
  readonly defaultIntervalValue: number = this.defaultConfigService.defaultSessions.interval;

  readonly availableTableColumns: TableColumn<SessionRawColumnKey>[] = [
    {
      name: $localize`Session ID`,
      key: 'sessionId',
      type: 'link',
      sortable: true,
      link: '/sessions',
    },
    {
      name: $localize`Status`,
      key: 'status',
      type: 'status',
      sortable: true,
    },
    {
      name: $localize`Cancelled at`,
      key: 'cancelledAt',
      type: 'date',
      sortable: true
    },
    {
      name: $localize`Created at`,
      key: 'createdAt',
      type: 'date',
      sortable: true
    },
    {
      name: $localize`Options`,
      key: 'options',
      type: 'object',
      sortable: false,
    },
    {
      name: $localize`Actions`,
      key: 'actions',
      type: 'actions',
      sortable: false,
    },
    {
      name: $localize`Duration`,
      key: 'duration',
      type: 'duration',
      sortable: true
    },
    {
      name: $localize`Partition Ids`,
      key: 'partitionIds',
      sortable: true,
    },
    {
      name: $localize`Tasks by Status`,
      key: 'count',
      type: 'count',
      sortable: false
    },
    {
      name: $localize`Options`,
      key: 'options.options',
      type: 'object',
      sortable: false
    },
    {
      name: $localize`Application Name`,
      key: 'options.applicationName',
      sortable: true,
    },
    {
      name: $localize`Deleted at`,
      key: 'deletedAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Purged at`,
      key: 'purgedAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Closed at`,
      key: 'closedAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Application Namespace`,
      key: 'options.applicationNamespace',
      sortable: true,
    },
    {
      name: $localize`Application Service`,
      key: 'options.applicationService',
      sortable: true,
    },
    {
      name: $localize`Application Version`,
      key: 'options.applicationVersion',
      sortable: true,
    },
    {
      name: $localize`Engine Type`,
      key: 'options.engineType',
      sortable: true,
    },
    {
      name: $localize`Max Duration`,
      key: 'options.maxDuration',
      type: 'duration',
      sortable: true,
    },
    {
      name: $localize`Max Retries`,
      key: 'options.maxRetries',
      sortable: true,
    },
    {
      name: $localize`Partition ID`,
      key: 'options.partitionId',
      sortable: true,
    },
    {
      name: $localize`Priority`,
      key: 'options.priority',
      sortable: true,
    },
  ];

  genericField(column: SessionRawColumnKey) {
    return column.replace('generic.', '');
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.tableService.saveIntervalValue('sessions-interval', value);
  }

  restoreIntervalValue(): number {
    return this.tableService.restoreIntervalValue('sessions-interval') ?? this.defaultIntervalValue;
  }

  /**
   * Lock columns
   */

  saveLockColumns(value: boolean): void {
    this.tableService.saveLockColumns('sessions-lock-columns', value);
  }

  restoreLockColumns(): boolean {
    return this.tableService.restoreLockColumns('sessions-lock-columns') ?? this.defaultLockColumns;
  }

  /**
   * Options
   */

  saveOptions(options: SessionRawListOptions): void {
    this.tableService.saveOptions('sessions-options', options);
  }

  restoreOptions(): SessionRawListOptions {
    const options = this.tableService.restoreOptions<SessionRaw>('sessions-options', this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: SessionRawColumnKey[]): void {
    this.tableService.saveColumns('sessions-columns', columns);
  }

  restoreColumns(): SessionRawColumnKey[] {
    const columns = this.tableService.restoreColumns<SessionRawColumnKey[]>('sessions-columns') ?? this.defaultColumns;

    return [...columns];
  }

  /**
   * Generic Columns
   */

  saveGenericColumns(columns: GenericColumn[]): void {
    this.tableService.saveColumns('sessions-generic-columns', columns);
  }
  
  restoreGenericColumns(): GenericColumn[] {
    const columns = this.tableService.restoreColumns<GenericColumn[]>('sessions-generic-columns') ?? [];
    return [...columns] ;
  }

  resetColumns(): SessionRawColumnKey[] {
    this.tableService.resetColumns('sessions-columns');

    return Array.from(this.defaultColumns);
  }
}
