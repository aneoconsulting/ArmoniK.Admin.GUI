import { Injectable, inject } from '@angular/core';
import { GenericColumn } from '@app/types/data';
import { IndexServiceGenericInterface } from '@app/types/services/indexService';
import { TableColumn } from '@components/table/column.type';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { SessionRaw, SessionRawColumnKey, SessionRawListOptions } from '../types';

@Injectable()
export class SessionsIndexService implements IndexServiceGenericInterface<SessionRawColumnKey, SessionRawListOptions> {
  defaultConfigService = inject(DefaultConfigService);
  tableService = inject(TableService);

  readonly defaultColumns: SessionRawColumnKey[] = this.defaultConfigService.defaultSessions.columns;
  readonly defaultLockColumns: boolean = this.defaultConfigService.defaultSessions.lockColumns;
  readonly availableColumns: SessionRawColumnKey[] = ['sessionId', 'status', 'cancelledAt', 'createdAt', 'options', 'actions', 'duration', 'partitionIds', 'count', 'options.options', 'options.applicationName', 'options.applicationNamespace', 'options.applicationService', 'options.applicationVersion', 'options.engineType', 'options.maxDuration', 'options.maxRetries', 'options.partitionId', 'options.priority'];

  readonly availableTableColumns: TableColumn<SessionRawColumnKey>[] = [
    {
      name: $localize`Session ID`,
      key: 'sessionId',
      type: 'simple',
      sortable: true,
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
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Tasks by Status`,
      key: 'count',
      type: 'count',
      sortable: false
    },
    {
      name: $localize`Options Options`,
      key: 'options.options',
      type: 'object',
      sortable: false
    },
    {
      name: $localize`Options Application Name`,
      key: 'options.applicationName',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Options Application Namespace`,
      key: 'options.applicationName',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Options Application Service`,
      key: 'options.applicationName',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Options Application Version`,
      key: 'options.applicationName',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Options  Engine Type`,
      key: 'options.applicationName',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Options Max Duration`,
      key: 'options.applicationName',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Options Max Retries`,
      key: 'options.applicationName',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Options Partition ID`,
      key: 'options.applicationName',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Options Priority`,
      key: 'options.applicationName',
      type: 'simple',
      sortable: true,
    },
  ];

  readonly columnsLabels: Record<SessionRawColumnKey, string> = {
    sessionId: $localize`Session ID`,
    status: $localize`Status`,
    cancelledAt: $localize`Cancelled at`,
    createdAt: $localize`Created at`,
    options: $localize`Options`,
    actions: $localize`Actions`,
    duration: $localize`Duration`,
    partitionIds: $localize`Partition Ids`,
    count: $localize`Tasks by Status`,
    'options.options': $localize`Options Options`,
    'options.applicationName': $localize`Options Application Name`,
    'options.applicationNamespace': $localize`Options Application Namespace`,
    'options.applicationService': $localize`Options Application Service`,
    'options.applicationVersion': $localize`Options Application Version`,
    'options.engineType': $localize`Options Engine Type`,
    'options.maxDuration': $localize`Options Max Duration`,
    'options.maxRetries': $localize`Options Max Retries`,
    'options.partitionId': $localize`Options Partition ID`,
    'options.priority': $localize`Options Priority`,
  };

  readonly defaultOptions: SessionRawListOptions = this.defaultConfigService.defaultSessions.options;

  readonly defaultIntervalValue: number = this.defaultConfigService.defaultSessions.interval;

  columnToLabel(column: SessionRawColumnKey): string {
    return this.columnsLabels[column] ?? column;
  }

  isGenericColumn(column: SessionRawColumnKey): boolean {
    return column.startsWith('generic.');
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
