import { RawColumnKey } from '@app/types/data';

export type ColumnType = 'link' | 'count' | 'object' | 'actions' | 'date' | 'duration' | 'status' | 'select' | 'raw';

export type TableColumn<K extends RawColumnKey> = {
  name: string;
  key: K;
  type?: ColumnType;
  sortable: boolean;
  link?: string;
  queryParams?: string;
};