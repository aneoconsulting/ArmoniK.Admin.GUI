import { Injectable, inject } from '@angular/core';
import { TableColumn } from '@app/types/column.type';
import { CustomColumn } from '@app/types/data';
import { IndexServiceCustomInterface } from '@app/types/services/indexService';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TaskOptions, TaskSummary, TaskSummaryColumnKey, TaskSummaryListOptions } from '../types';

@Injectable()
export class TasksIndexService implements IndexServiceCustomInterface<TaskSummary, TaskOptions> {
  defaultConfigService = inject(DefaultConfigService);
  tableService = inject(TableService);

  readonly defaultColumns: TaskSummaryColumnKey[] = this.defaultConfigService.defaultTasks.columns;
  readonly defaultLockColumns: boolean = this.defaultConfigService.defaultTasks.lockColumns;
  readonly defaultOptions: TaskSummaryListOptions = this.defaultConfigService.defaultTasks.options;
  readonly defaultIntervalValue: number = this.defaultConfigService.defaultTasks.interval;
  readonly defaultViewInLogs = this.defaultConfigService.defaultTasksViewInLogs;

  readonly availableTableColumns: TableColumn<TaskSummary, TaskOptions>[] = [
    {
      name: $localize`Task ID`,
      key: 'id',
      type: 'link',
      sortable: true,
      link: '/tasks',
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
      type: 'link',
      sortable: true,
      link: '/sessions',
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
      sortable: true,
    },
    {
      name: $localize`Owner Pod ID`,
      key: 'ownerPodId',
      sortable: true,
    },
    {
      name: $localize`Pod Hostname`,
      key: 'podHostname',
      sortable: true,
    },
    {
      name: $localize`Pod TTL`,
      key: 'podTtl',
      type: 'duration',
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
      sortable: false,
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
      type: 'object',
      sortable: false,
    },
    {
      name: $localize`Count Data Dependencies`,
      key: 'countDataDependencies',
      sortable: false,
    },
    {
      name: $localize`Count Expected Output Ids`,
      key: 'countExpectedOutputIds',
      sortable: false,
    },
    {
      name: $localize`Count Parent Task Ids`,
      key: 'countParentTaskIds',
      sortable: false,
    },
    {
      name: $localize`Count Retry Of Ids`,
      key: 'countRetryOfIds',
      sortable: false,
    },
    {
      name: $localize`Error`,
      key: 'error',
      sortable: false,
    },
    {
      name: $localize`Select`,
      key: 'select',
      type: 'select',
      sortable: false,
    },
    {
      name: $localize`Fetched at`,
      key: 'fetchedAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Processed at`,
      key: 'processedAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Received to End Duration`,
      key: 'receivedToEndDuration',
      type: 'duration',
      sortable: true,
    },
    {
      name: $localize`Application Name`,
      key: 'options.applicationName',
      sortable: true,
    },
    {
      name: $localize`Application Version`,
      key: 'options.applicationVersion',
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
      name: $localize`Custom Data`,
      key: 'options.options',
      type: 'object',
      sortable: false,
    },
    {
      name: $localize`Priority`,
      key: 'options.priority',
      sortable: true,
    },
    {
      name: $localize`Partition Id`,
      key: 'options.partitionId',
      sortable: true,
    }
  ];

  customField(column: TaskSummaryColumnKey) {
    return column.replace('options.options.', '');
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
    const options = this.tableService.restoreOptions<TaskSummary, TaskOptions>('tasks-options', this.defaultOptions);

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
   * Custom Columns
   */

  saveCustomColumns(columns: CustomColumn[]): void {
    this.tableService.saveColumns('tasks-custom-columns', columns);
  }

  restoreCustomColumns(): CustomColumn[] {
    const columns = this.tableService.restoreColumns<CustomColumn[]>('tasks-custom-columns') ?? [];
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
