import { Injectable, inject } from '@angular/core';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawListOptions } from '../types';

@Injectable()
// TODO: re-add app-index-service
export class PartitionsIndexService {
  #defaultConfigService = inject(DefaultConfigService);

  readonly tableName: string = 'partitions';

  readonly defaultColumns: PartitionRawColumnKey[] = this.#defaultConfigService.defaultPartitions.columns;
  readonly defaultLockColumns: boolean = this.#defaultConfigService.defaultPartitions.lockColumns;
  readonly availableColumns: PartitionRawColumnKey[] = ['id', 'priority', 'parentPartitionIds', 'podConfiguration', 'podMax', 'podReserved', 'preemptionPercentage', 'count'];

  // TODO: We could use a custom type to know which columns are objects
  readonly objectColumns: PartitionRawColumnKey[] = ['podConfiguration', 'parentPartitionIds'];

  readonly columnsLabels: Record<PartitionRawColumnKey, string> = {
    id: $localize`ID`,
    priority: $localize`Priority`,
    parentPartitionIds: $localize`Parent Partition Ids`,
    podConfiguration: $localize`Pod Configuration`,
    podMax: $localize`Pod Max`,
    podReserved: $localize`Pod Reserved`,
    preemptionPercentage: $localize`Preemption Percentage`,
    actions: $localize`Actions`,
    count: $localize`Tasks by Status`,
  };

  readonly defaultOptions: PartitionRawListOptions = this.#defaultConfigService.defaultPartitions.options;

  readonly defaultIntervalValue: number = this.#defaultConfigService.defaultPartitions.interval;

  #tableService = inject(TableService);

  columnToLabel(column: PartitionRawColumnKey): string {
    return this.columnsLabels[column];
  }

  /**
   * Table
   */
  isPartitionIdColumn(column: PartitionRawColumnKey): boolean {
    return column === 'id';
  }


  isNotSortableColumn(column: PartitionRawColumnKey): boolean {
    return this.isObjectColumn(column) || this.isCountColumn(column);
  }

  isObjectColumn(column: PartitionRawColumnKey): boolean {
    return this.objectColumns.includes(column);
  }

  isCountColumn(column: PartitionRawColumnKey): boolean {
    return column === 'count';
  }

  isSimpleColumn(column: PartitionRawColumnKey): boolean {
    return !this.isPartitionIdColumn(column) && !this.isObjectColumn(column) && !this.isCountColumn(column);
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.#tableService.saveIntervalValue('partitions-interval', value);
  }

  restoreIntervalValue(): number {
    return this.#tableService.restoreIntervalValue('partitions-interval') ?? this.defaultIntervalValue;
  }

  /**
   * Lock columns
   */

  saveLockColumns(value: boolean): void {
    this.#tableService.saveLockColumns('partitions-lock-columns', value);
  }

  restoreLockColumns(): boolean {
    return this.#tableService.restoreLockColumns('partitions-lock-columns') ?? this.defaultLockColumns;
  }

  /**
   * Options
   */

  saveOptions(options: PartitionRawListOptions): void {
    this.#tableService.saveOptions('partitions-options', options);
  }

  restoreOptions(): PartitionRawListOptions {
    const options = this.#tableService.restoreOptions<PartitionRaw>('partitions-options', this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: PartitionRawColumnKey[]): void {
    this.#tableService.saveColumns('partitions-columns', columns);
  }

  restoreColumns(): PartitionRawColumnKey[] {
    return this.#tableService.restoreColumns<PartitionRawColumnKey[]>('partitions-columns') ?? this.defaultColumns;
  }

  resetColumns(): PartitionRawColumnKey[] {
    this.#tableService.resetColumns('partitions-columns');

    return Array.from(this.defaultColumns);
  }
}
