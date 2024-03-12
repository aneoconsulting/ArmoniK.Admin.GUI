import { RawColumnKey } from '@app/types/data';

export type TableColumn<K extends RawColumnKey> = {
  name: string;
  key: K;
  type?: 'link' | 'count' | 'object' | 'actions' | 'date' | 'duration' | 'status' | 'select' | 'special';
  sortable: boolean;
  link?: string;
  queryParams?: Record<string, string>;
};