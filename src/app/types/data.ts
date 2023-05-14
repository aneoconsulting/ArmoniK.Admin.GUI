import { SortDirection as MatSortDirection } from '@angular/material/sort';

export type Column<T extends object> = keyof T | 'actions';

export type FilterField<T extends object> = keyof T;

export type Filter<T extends object> = {
  field: FilterField<T> | null
  value: string | null
};

export type FiltersDialogData<T extends object> = {
  availableFiltersFields: FilterField<T>[],
  filters: Filter<T>[]
};

export type ListOptions<T extends object> = {
  pageIndex: number
  pageSize: number
  sort: {
    active: FilterField<T>
    direction: MatSortDirection
  },
};

// export type SortDirection = {
//   [key in Exclude<MatSortDirection, ''>]: ArmonikSortDirection
// }

// TODO: Les filters fields sont les changes présents en base de données et s'il s'agit d'un type date, alors il faut pouvoir remplir un champs before et after (donc il va falloir créer plein de types (un peu à la notion) (mais il faut d'abord faire les types)
