import { SortDirection as MatSortDirection } from '@angular/material/sort';
import { DataRaw, FieldKey } from './data';

export type ListOptions<T extends DataRaw> = {
  pageIndex: number
  pageSize: number
  sort: {
    active: FieldKey<T>
    direction: MatSortDirection
  },
};
