import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, DataRaw } from '@app/types/data';

export type ColumnType = 'link' | 'count' | 'object' | 'actions' | 'date' | 'duration' | 'status' | 'select' | 'raw';

export type TableColumn<T extends DataRaw, O extends TaskOptions | null = null> = {
  name: string;
  key: ColumnKey<T, O>;
  type?: ColumnType;
  sortable: boolean;
  link?: string;
  queryParams?: string;
};