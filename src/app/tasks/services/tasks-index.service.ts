import { Injectable, inject } from '@angular/core';
import { GenericColumn } from '@app/types/data';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TaskSummary, TaskSummaryColumnKey, TaskSummaryListOptions } from '../types';

@Injectable()
export class TasksIndexService {
  #defaultConfigService = inject(DefaultConfigService);
  #tableService = inject(TableService);

  readonly defaultColumns: TaskSummaryColumnKey[] = this.#defaultConfigService.defaultTasks.columns;
  readonly defaultLockColumns: boolean = this.#defaultConfigService.defaultTasks.lockColumns;
  readonly availableColumns: TaskSummaryColumnKey[] = [
    'id', 'acquiredAt', 'actions', 'createdAt', 'creationToEndDuration', 'endedAt','initialTaskId', 'options', 'options.applicationName', 'options.maxDuration', 'options.applicationNamespace', 'options.options', 'options.applicationService', 'options.applicationVersion', 'options.engineType', 'options.maxRetries', 'options.partitionId', 'options.priority', 'ownerPodId', 'podHostname', 'podTtl', 'processingToEndDuration', 'receivedAt', 'sessionId', 'startedAt', 'status', 'statusMessage', 'submittedAt', 'countDataDependencies', 'countExpectedOutputIds', 'countParentTaskIds', 'countRetryOfIds', 'select'
  ];

  readonly dateColumns: TaskSummaryColumnKey[] = ['podTtl','acquiredAt', 'createdAt', 'endedAt', 'receivedAt', 'startedAt', 'submittedAt'];
  readonly durationColumns: TaskSummaryColumnKey[] = ['creationToEndDuration', 'processingToEndDuration', 'options.maxDuration'];
  readonly objectColumns: TaskSummaryColumnKey[] = ['options', 'options.options'];

  readonly columnsLabels: Record<TaskSummaryColumnKey, string> = {
    id: $localize`Task ID`,
    status: $localize`Status`,
    createdAt: $localize`Created at`,
    actions: $localize`Actions`,
    'options.applicationName': $localize`Options Application Name`,
    'options.applicationNamespace': $localize`Options Application Namespace`,
    'options.applicationService': $localize`Options Application Service`,
    'options.applicationVersion': $localize`Options Application Version`,
    'options.engineType': $localize`Options Engine Type`,
    'options.maxDuration': $localize`Options Max Duration`,
    'options.maxRetries': $localize`Options Max Retries`,
    'options.partitionId': $localize`Options Partition ID`,
    'options.priority': $localize`Options Priority`,
    'options.options': $localize`Options Options`,
    sessionId: $localize`Session ID`,
    acquiredAt: $localize`Acquired at`,
    endedAt: $localize`Ended at`,
    initialTaskId: $localize`Initial Task ID`,
    ownerPodId: $localize`Owner Pod ID`,
    podHostname: $localize`Pod Hostname`,
    podTtl: $localize`Pod TTL`,
    receivedAt: $localize`Received at`,
    startedAt: $localize`Started at`,
    statusMessage: $localize`Status Message`,
    submittedAt: $localize`Submitted at`,
    creationToEndDuration: $localize`Creation to End Duration`,
    processingToEndDuration: $localize`Processing to End Duration`,
    options: $localize`Options`,
    countDataDependencies: $localize`Count Data Dependencies`,
    countExpectedOutputIds: $localize`Count Expected Output Ids`,
    countParentTaskIds: $localize`Count Parent Task Ids`,
    countRetryOfIds: $localize`Count Retry Of Ids`,
    error: $localize`Error`,
    select: $localize`Select`,
  };

  readonly defaultOptions: TaskSummaryListOptions = this.#defaultConfigService.defaultTasks.options;

  readonly defaultIntervalValue: number = this.#defaultConfigService.defaultTasks.interval;

  readonly defaultViewInLogs = this.#defaultConfigService.defaultTasksViewInLogs;

  columnToLabel(column: TaskSummaryColumnKey): string {
    return !this.isGenericColumn(column) ? this.columnsLabels[column] : this.genericField(column);
  }

  /**
   * Table
   */
  isActionsColumn(column: TaskSummaryColumnKey): boolean {
    return column === 'actions';
  }

  isTaskIdColumn(column: TaskSummaryColumnKey): boolean {
    return column === 'id';
  }

  isStatusColumn(column: TaskSummaryColumnKey): boolean {
    return column === 'status';
  }

  isDateColumn(column: TaskSummaryColumnKey): boolean {
    return this.dateColumns.includes(column);
  }

  isDurationColumn(column: TaskSummaryColumnKey): boolean {
    return this.durationColumns.includes(column);
  }

  isObjectColumn(column: TaskSummaryColumnKey): boolean {
    return this.objectColumns.includes(column);
  }

  isSelectColumn(column: TaskSummaryColumnKey): boolean {
    return column === 'select';
  }

  isSimpleColumn(column: TaskSummaryColumnKey): boolean {
    return !this.isDateColumn(column) && !this.isDurationColumn(column) && !this.isObjectColumn(column) && !this.isStatusColumn(column) && !this.isTaskIdColumn(column) && !this.isActionsColumn(column) && !this.isSelectColumn(column) && !this.isGenericColumn(column);
  }

  isNotSortableColumn(column: TaskSummaryColumnKey): boolean {
    return this.isActionsColumn(column) || this.isObjectColumn(column) || this.isSelectColumn(column);
  }

  isGenericColumn(column: TaskSummaryColumnKey): boolean {
    return column.startsWith('generic.');
  }

  genericField(column: TaskSummaryColumnKey) {
    return column.replace('generic.', '');
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.#tableService.saveIntervalValue('tasks-interval', value);
  }

  restoreIntervalValue(): number {
    return this.#tableService.restoreIntervalValue('tasks-interval') ?? this.defaultIntervalValue;
  }

  /**
   * Lock columns
   */

  saveLockColumns(value: boolean): void {
    this.#tableService.saveLockColumns('tasks-lock-columns', value);
  }

  restoreLockColumns(): boolean {
    return this.#tableService.restoreLockColumns('tasks-lock-columns') ?? this.defaultLockColumns;
  }

  /**
   * Options
   */

  saveOptions(options: TaskSummaryListOptions): void {
    this.#tableService.saveOptions('tasks-options', options);
  }

  restoreOptions(): TaskSummaryListOptions {
    const options = this.#tableService.restoreOptions<TaskSummary>('tasks-options', this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: TaskSummaryColumnKey[]): void {
    this.#tableService.saveColumns('tasks-columns', columns);
  }

  restoreColumns(): TaskSummaryColumnKey[] {
    const columns = this.#tableService.restoreColumns<TaskSummaryColumnKey[]>('tasks-columns') ?? this.defaultColumns;

    return [...columns];
  }

  resetColumns(): TaskSummaryColumnKey[] {
    this.#tableService.resetColumns('tasks-columns');

    return Array.from(this.defaultColumns);
  }

  /**
   * Generic Columns
   */

  saveGenericColumns(columns: GenericColumn[]): void {
    this.#tableService.saveColumns('tasks-generic-columns', columns);
  }

  restoreGenericColumns(): GenericColumn[] {
    const columns = this.#tableService.restoreColumns<GenericColumn[]>('tasks-generic-columns') ?? [];
    return [...columns] ;
  }

  /**
   * View in Logs
   */
  restoreViewInLogs() {
    return this.#tableService.restoreViewInLogs('tasks-view-in-logs') ?? this.defaultViewInLogs;
  }

  saveViewInLogs(serviceIcon: string, serviceName: string, urlTemplate: string) {
    this.#tableService.saveViewInLogs('tasks-view-in-logs', serviceIcon, serviceName, urlTemplate);
  }
}
