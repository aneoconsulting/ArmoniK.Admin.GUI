import { Injectable, inject } from '@angular/core';
import { IndexServiceInterface } from '@app/types/services/indexService';
import { TableColumn } from '@components/table/column.type';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawListOptions } from '../types';

@Injectable()
// TODO: re-add app-index-service
export class PartitionsIndexService implements IndexServiceInterface<PartitionRawColumnKey, PartitionRawListOptions> {
  columnsLabels: Record<PartitionRawColumnKey, string>;
  readonly defaultConfigService = inject(DefaultConfigService);
  readonly tableService = inject(TableService);

  readonly defaultColumns: PartitionRawColumnKey[] = this.defaultConfigService.defaultPartitions.columns;
  readonly defaultLockColumns: boolean = this.defaultConfigService.defaultPartitions.lockColumns;
  readonly defaultOptions: PartitionRawListOptions = this.defaultConfigService.defaultPartitions.options;
  readonly defaultIntervalValue: number = this.defaultConfigService.defaultPartitions.interval;

  readonly availableTableColumns: TableColumn<PartitionRawColumnKey>[] = [
    {
      name: $localize`ID`,
      key: 'id',
      type: 'link',
      sortable: true,
      link: '/partitions',
    },
    {
      name: $localize`Priority`,
      key: 'priority',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Parent Partition Ids`,
      key: 'parentPartitionIds',
      type: 'object',
      sortable: true
    },
    {
      name: $localize`Pod Configuration`,
      key: 'podConfiguration',
      type: 'object',
      sortable: true,
    },
    {
      name: $localize`Pod Max`,
      key: 'podMax',
      type: 'simple',
      sortable: true, 
    },
    {
      name: $localize`Pod Reserved`,
      key: 'podReserved',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Preemption Percentage`,
      key: 'preemptionPercentage',
      type: 'simple',
      sortable: true,
    },
    {
      name: $localize`Tasks by Status`,
      key: 'count',
      type: 'count',
      sortable: false
    }
  ];

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this.tableService.saveIntervalValue('partitions-interval', value);
  }

  restoreIntervalValue(): number {
    return this.tableService.restoreIntervalValue('partitions-interval') ?? this.defaultIntervalValue;
  }

  /**
   * Lock columns
   */

  saveLockColumns(value: boolean): void {
    this.tableService.saveLockColumns('partitions-lock-columns', value);
  }

  restoreLockColumns(): boolean {
    return this.tableService.restoreLockColumns('partitions-lock-columns') ?? this.defaultLockColumns;
  }

  /**
   * Options
   */

  saveOptions(options: PartitionRawListOptions): void {
    this.tableService.saveOptions('partitions-options', options);
  }

  restoreOptions(): PartitionRawListOptions {
    const options = this.tableService.restoreOptions<PartitionRaw>('partitions-options', this.defaultOptions);
    return options;
  }

  /**
   * Columns
   */

  saveColumns(columns: PartitionRawColumnKey[]): void {
    this.tableService.saveColumns('partitions-columns', columns);
  }

  restoreColumns(): PartitionRawColumnKey[] {
    return this.tableService.restoreColumns<PartitionRawColumnKey[]>('partitions-columns') ?? this.defaultColumns;
  }

  resetColumns(): PartitionRawColumnKey[] {
    this.tableService.resetColumns('partitions-columns');

    return Array.from(this.defaultColumns);
  }
}
