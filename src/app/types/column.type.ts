import { TaskOptions } from '@app/tasks/types';
import { DataRaw, FieldKey, RawColumnKey } from '@app/types/data';

export type ColumnType = 'link' | 'count' | 'object' | 'actions' | 'date' | 'duration' | 'status' | 'select' | 'raw' | 'array';

export type Field<T extends DataRaw, O extends TaskOptions | null = null> = {
  key: FieldKey<T & O>;
  type?: ColumnType;
  link?: string;
};

export type TableColumn<K extends RawColumnKey> = {
  name: string;
  key: K;
  type?: ColumnType;
  sortable: boolean;
  link?: string;
  queryParams?: string;
};