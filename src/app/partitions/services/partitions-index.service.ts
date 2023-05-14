import { Injectable } from '@angular/core';
import { TableService } from '@services/table.service';
import { Filter, FilterField, ListOptions } from '@app/types/data';
import { AppIndexService } from '@app/types/services';
import { PartitionRaw, PartitionRawColumn, PartitionRawFilter, PartitionRawListOptions } from '../types';

@Injectable()
export class PartitionsIndexService implements AppIndexService<PartitionRaw> {
  readonly tableName: string = 'partitions';

  readonly defaultColumns: PartitionRawColumn[] = ['id', 'actions'];
  readonly availableColumns: PartitionRawColumn[] = ['id', 'priority', 'parentPartitionIds', 'podConfiguration', 'podMax', 'podReserved', 'preemptionPercentage', 'actions'];

  readonly defaultOptions: ListOptions<PartitionRaw> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'id',
      direction: 'asc'
    },
  };

  readonly defaultFilters: Filter<PartitionRaw>[] = [];
  readonly availableFiltersFields: FilterField<PartitionRaw>[] = ['id', 'priority', 'parentPartitionIds', 'podConfiguration', 'podMax', 'podReserved', 'preemptionPercentage'];

  readonly defaultIntervalValue: number = 10;

  constructor(private _tableService: TableService) {}

  // TODO: Create function in table service
  generateSharableURL(options: PartitionRawListOptions): string {
    return '/partitions';
  }

  /**
   * Interval
   */

  saveIntervalValue(value: number): void {
    this._tableService.saveIntervalValue(this.tableName, value);
  }

  restoreIntervalValue(): number {
    return this._tableService.restoreIntervalValue(this.tableName) ?? this.defaultIntervalValue;
  }

  /**
   * Options
   */

  saveOptions(options: PartitionRawListOptions): void {
    this._tableService.saveOptions(this.tableName, options);
  }

  restoreOptions(): PartitionRawListOptions {
    const options = this._tableService.restoreOptions<PartitionRaw>(this.tableName, this.defaultOptions);

    return options;
  }

  /**
   * Columns
   */

  restoreColumns(): PartitionRawColumn[] {
    return this._tableService.restoreColumns<PartitionRawColumn[]>(this.tableName) ?? this.defaultColumns;
  }

  saveColumns(columns: PartitionRawColumn[]): void {
    this._tableService.saveColumns(this.tableName, columns);
  }

  resetColumns(): PartitionRawColumn[] {
    this._tableService.resetColumns(this.tableName);

    return this.defaultColumns;
  }

  /**
   * Filters
   */

  saveFilters(filters: PartitionRawFilter[]): void {
    this._tableService.saveFilters(this.tableName, filters);
  }

  restoreFilters(): PartitionRawFilter[] {
    return this._tableService.restoreFilters<PartitionRawFilter[]>(this.tableName) ?? this.defaultFilters;
  }

  resetFilters(): PartitionRawFilter[] {
    this._tableService.resetFilters(this.tableName);

    return this.defaultFilters;
  }


  // readonly sortDirections: PartitionRawSortDirection = {
  //   asc: ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_ASC,
  //   desc: ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_DESC
  // }
}
