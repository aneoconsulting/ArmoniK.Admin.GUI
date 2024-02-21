import { RawColumnKey } from '@app/types/data';

export type TableColumn<K extends RawColumnKey> = {
  name: string;
  key: K;
  type: 'link' | 'action' | 'simple' | 'count' | 'object' | 'actions';
  sortable: boolean;
  link?: string;
  queryParams?: Record<string, string>;
};