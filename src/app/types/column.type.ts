import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, DataRaw } from '@app/types/data';

export type DataType = 'raw' | 'link' | 'object' | 'date' | 'duration' | 'status' | 'array' | 'output' | 'message'; 
export type ColumnType = DataType | 'count' | 'actions' | 'select';

export type Field<T extends DataRaw | TaskOptions | null> = {
  key: keyof T;
  type?: DataType;
  link?: string;
  queryParams?: string;
};

export type TableColumn<T extends DataRaw, O extends TaskOptions | null = null> = {
  name: string;
  key: ColumnKey<T, O>;
  type?: ColumnType;
  sortable: boolean;
  link?: string;
};