import { RawColumnKey } from '@app/types/data';

export type ColumnType = 'link' | 'count' | 'object' | 'actions' | 'date' | 'duration' | 'status' | 'select' | 'raw' | 'array';

export type Field<K extends RawColumnKey> = {
  key: K;
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