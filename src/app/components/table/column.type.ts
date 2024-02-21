import { Subject } from 'rxjs';
import { RawColumnKey } from '@app/types/data';

export type TableColumn<K extends RawColumnKey> = {
  name: string;
  key: K;
  type: 'link' | 'action' | 'simple' | 'count' | 'object';
  sortable: boolean;
  link?: string;
  queryParams?: Record<string, string>;
};

export type ActionTableColumn = {
  name: string;
  icon: string;
  action$: Subject<void>;
};