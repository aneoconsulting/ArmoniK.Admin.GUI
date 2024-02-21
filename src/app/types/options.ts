import { SortDirection as MatSortDirection } from '@angular/material/sort';
import { FieldKey } from './data';

export type ListOptions<T extends object> = {
  pageIndex: number
  pageSize: number
  sort: ListSortOptions<T>
};

export type ListSortOptions<T extends object> = {
  active: FieldKey<T>
  direction: MatSortDirection
};
