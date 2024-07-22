import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, DataRaw, FieldKey } from '@app/types/data';

export type DataType = 'raw' | 'link' | 'object' | 'date' | 'duration' | 'status' | 'array'; 
export type ColumnType = DataType | 'count' | 'actions' | 'select';

export type Field<T extends DataRaw, O extends TaskOptions | null = null> = {
  key: FieldKey<T & O> | `options.${string}`;
  type?: DataType;
  link?: string;
};

export type TableColumn<T extends DataRaw, O extends TaskOptions | null = null> = {
  name: string;
  key: ColumnKey<T, O>;
  type?: ColumnType;
  sortable: boolean;
  link?: string;
  queryParams?: string;
};