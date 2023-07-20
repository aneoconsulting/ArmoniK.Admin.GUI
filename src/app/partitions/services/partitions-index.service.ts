import { Injectable, inject } from '@angular/core';
import { AppIndexService } from '@app/types/services';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFilter, PartitionRawFilterField, PartitionRawListOptions } from '../types';

@Injectable()
export class PartitionsIndexService implements AppIndexService<PartitionRaw> {
  #defaultConfigService = inject(DefaultConfigService);

  readonly tableName: string = 'partitions';

  readonly defaultColumns: PartitionRawColumnKey[] = this.#defaultConfigService.defaultPartitions.columns;
  readonly availableColumns: PartitionRawColumnKey[] = ['id', 'priority', 'parentPartitionIds', 'podConfiguration', 'podMax', 'podReserved', 'preemptionPercentage', 'actions'];

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
  };

  readonly defaultOptions: PartitionRawListOptions = this.#defaultConfigService.defaultPartitions.options;

  readonly defaultFilters: PartitionRawFilter[] = this.#defaultConfigService.defaultPartitions.filters;
  readonly availableFiltersFields: PartitionRawFilterField[] = [
    // Do not add filter on array or object fields
    {
      field: 'id',
      type: 'text',
    },
    {
      field: 'priority',
      type: 'number',
    },
    {
      field: 'podMax',
      type: 'number',
    },
    {
      field: 'podReserved',
      type: 'number',
    },
    {
      field: 'preemptionPercentage',
      type: 'number',
    },
  ];

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

  isActionsColumn(column: PartitionRawColumnKey): boolean {
    return column === 'actions';
  }

  isNotSortableColumn(column: PartitionRawColumnKey): boolean {
    return this.isActionsColumn(column) || this.isObjectColumn(column);
  }

  isObjectColumn(column: PartitionRawColumnKey): boolean {
    return this.objectColumns.includes(column);
  }

  isSimpleColumn(column: PartitionRawColumnKey): boolean {
    return !this.isActionsColumn(column) && !this.isPartitionIdColumn(column) && !this.isObjectColumn(column);
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

  /**
   * Filters
   */

  saveFilters(filters: PartitionRawFilter[]): void {
    this.#tableService.saveFilters('partitions-filters', filters);
  }

  restoreFilters(): PartitionRawFilter[] {
    return this.#tableService.restoreFilters<PartitionRaw>('partitions-filters', this.availableFiltersFields) ?? this.defaultFilters;
  }

  resetFilters(): PartitionRawFilter[] {
    this.#tableService.resetFilters('partitions-filters');

    return this.defaultFilters;
  }
}
