import { RawColumnKey } from '@app/types/data';

export type TableColumn<K extends RawColumnKey> = {
  name: string;
  key: K;
  type?: 'link' | 'count' | 'object' | 'actions' | 'date' | 'duration' | 'status' | 'select' | 'outer-link';
  sortable: boolean;
  link?: string;
  queryParams?: string;
};