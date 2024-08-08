import { SortDirection as MatSortDirection } from '@angular/material/sort';
import { TaskOptions } from '@app/tasks/types';
import { DataRaw, FieldKey } from './data';

export type ListOptions<T extends DataRaw, O extends TaskOptions | null = null> = {
  pageIndex: number
  pageSize: number
  sort: ListOptionsSort<T, O>
};

export type ListOptionsSort<T extends DataRaw, O extends TaskOptions | null = null> = {
  active: FieldKey<T & O>
  direction: MatSortDirection
};
