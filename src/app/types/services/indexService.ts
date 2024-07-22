import { TaskOptions } from '@app/tasks/types';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TableColumn } from '../column.type';
import { ColumnKey, CustomColumn, DataRaw } from '../data';
import { ListOptions } from '../options';

export interface IndexServiceInterface<T extends DataRaw, O extends TaskOptions | null = null> {
  readonly defaultConfigService: DefaultConfigService;
  readonly tableService: TableService;

  readonly defaultColumns: ColumnKey<T, O>[];
  readonly availableTableColumns: TableColumn<T, O>[];

  readonly defaultOptions: ListOptions<T, O>;

  readonly defaultIntervalValue: number;
  readonly defaultLockColumns: boolean;

  // Interval
  saveIntervalValue(value: number): void;
  restoreIntervalValue(): number;

  // Lock columns
  saveLockColumns(value: boolean): void;
  restoreLockColumns(): boolean;

  // Options
  saveOptions(options: ListOptions<T, O>): void;
  restoreOptions(): ListOptions<T, O>;

  // Columns
  saveColumns(columns: ColumnKey<T, O>[]): void;
  restoreColumns(): ColumnKey<T, O>[];
  resetColumns(): ColumnKey<T, O>[];
}

export interface IndexServiceCustomInterface<T extends DataRaw, O extends TaskOptions | null = null> extends IndexServiceInterface<T, O> {
  saveCustomColumns(columns: CustomColumn[]): void;

  restoreCustomColumns(): CustomColumn[];

  customField(column: ColumnKey<T, O>): string;
}