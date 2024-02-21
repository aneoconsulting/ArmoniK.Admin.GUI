import { Injectable, inject } from '@angular/core';
import { GenericColumn } from '@app/types/data';
import { IndexServiceGenericInterface } from '@app/types/services/indexService';
import { TableColumn } from '@components/table/column.type';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryListOptions } from '../types';

@Injectable()
export class TasksIndexService implements IndexServiceGenericInterface<TaskSummaryColumnKey, TaskSummaryListOptions> {
  defaultConfigService = inject(DefaultConfigService);
  tableService = inject(TableService);

  readonly defaultColumns: TaskSummaryColumnKey[] = this.defaultConfigService.defaultTasks.columns;
  readonly defaultLockColumns: boolean = this.defaultConfigService.defaultTasks.lockColumns;

  readonly availableTableColumns: TableColumn<TaskSummaryColumnKey>[] = [
    {
      name: $localize`Task ID`,
      key: 'id',
      type: 'link',
      sortable: true,
    },
    {
      name: $localize`Status`,
      key: 'status',
      type: 'status',
      sortable: true,
    },
    {
      name: $localize`Created at`,
      key: 'createdAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Actions`,
      key: 'actions',
      type: 'actions',
      sortable: false,
    },
    {
      name: $localize`Session ID`,
      key: 'sessionId',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Acquired at`,
      key: 'acquiredAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Ended at`,
      key: 'endedAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Initial Task ID`,
      key: 'initialTaskId',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Owner Pod ID`,
      key: 'ownerPodId',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Pod Hostname`,
      key: 'podHostname',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Pod TTL`,
      key: 'podTtl',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Received at`,
      key: 'receivedAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Started at`,
      key: 'startedAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Status Message`,
      key: 'statusMessage',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Submitted at`,
      key: 'submittedAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Creation to End Duration`,
      key: 'creationToEndDuration',
      type: 'duration',
      sortable: true,
    },
    {
      name: $localize`Processing to End Duration`,
      key: 'processingToEndDuration',
      type: 'duration',
      sortable: true,
    },
    {
      name: $localize`Options`,
      key: 'options',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Count Data Dependencies`,
      key: 'countDataDependencies',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Count Expected Output Ids`,
      key: 'countExpectedOutputIds',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Count Parent Task Ids`,
      key: 'countParentTaskIds',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Count Retry Of Ids`,
      key: 'countRetryOfIds',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Error`,
      key: 'error',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Select`,
      key: 'select',
      type: 'select',
      sortable: false,
    }
  ];

  readonly defaultOptions: TaskSummaryListOptions = this.defaultConfigService.defaultTasks.options;

  readonly defaultIntervalValue: number = this.defaultConfigService.defaultTasks.interval;

  readonly defaultViewInLogs = this.defaultConfigService.defaultTasksViewInLogs;


  /**
   * Table
   */
  genericField(column: TaskSummaryColumnKey) {
    return column.replace('generic.', '');
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.tableService.saveIntervalValue('tasks-interval', value);
  }

  restoreIntervalValue(): number {
    return this.tableService.restoreIntervalValue('tasks-interval') ?? this.defaultIntervalValue;
  }

  /**
   * Lock columns
   */

  saveLockColumns(value: boolean): void {
    this.tableService.saveLockColumns('tasks-lock-columns', value);
  }

  restoreLockColumns(): boolean {
    return this.tableService.restoreLockColumns('tasks-lock-columns') ?? this.defaultLockColumns;
  }

  /**
   * Options
   */

  saveOptions(options: TaskSummaryListOptions): void {
    this.tableService.saveOptions('tasks-options', options);
  }

  restoreOptions(): TaskSummaryListOptions {
    const options = this.tableService.restoreOptions<TaskSummary>('tasks-options', this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: TaskSummaryColumnKey[]): void {
    this.tableService.saveColumns('tasks-columns', columns);
  }

  restoreColumns(): TaskSummaryColumnKey[] {
    const columns = this.tableService.restoreColumns<TaskSummaryColumnKey[]>('tasks-columns') ?? this.defaultColumns;

    return [...columns];
  }

  resetColumns(): TaskSummaryColumnKey[] {
    this.tableService.resetColumns('tasks-columns');

    return Array.from(this.defaultColumns);
  }

  /**
   * Generic Columns
   */

  saveGenericColumns(columns: GenericColumn[]): void {
    this.tableService.saveColumns('tasks-generic-columns', columns);
  }

  restoreGenericColumns(): GenericColumn[] {
    const columns = this.tableService.restoreColumns<GenericColumn[]>('tasks-generic-columns') ?? [];
    return [...columns] ;
  }

  /**
   * View in Logs
   */
  restoreViewInLogs() {
    return this.tableService.restoreViewInLogs('tasks-view-in-logs') ?? this.defaultViewInLogs;
  }

  saveViewInLogs(serviceIcon: string, serviceName: string, urlTemplate: string) {
    this.tableService.saveViewInLogs('tasks-view-in-logs', serviceIcon, serviceName, urlTemplate);
  }
}
