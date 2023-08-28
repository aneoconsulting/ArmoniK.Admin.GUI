import { SortDirection as MatSortDirection } from '@angular/material/sort';
import { FieldKey } from './data';

export type ListOptions<T extends object> = {
  pageIndex: number
  pageSize: number
  sort: {
    active: FieldKey<T>
    direction: MatSortDirection
  },
};
