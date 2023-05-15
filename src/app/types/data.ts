import { SortDirection as MatSortDirection } from '@angular/material/sort';
import { DateTime } from 'luxon';

export type Column<T extends object> = keyof T | 'actions';

export type KeyField<T extends object> = keyof T;

export type FilterInputValueText = string | null;
export type FilterInputValueDate = { start: string | null, end: string | null };
export type FilterInputValue = FilterInputValueText | FilterInputValueDate;

export interface FilterInputText {
  type: 'text';
  value: FilterInputValueText;
}
export interface FilterInputDate  {
  type: 'date';
  value: FilterInputValueDate;
}
export type FilterInput = FilterInputText | FilterInputDate;
export type FilterInputType = FilterInput['type'];

export type Filter<T extends object> = {
  field: KeyField<T> | null
  value?: FilterInputValue
};

export type FiltersDialogData<T extends object> = {
  availableFiltersFields: FilterField<T>[],
  filters: Filter<T>[]
};

export type ListOptions<T extends object> = {
  pageIndex: number
  pageSize: number
  sort: {
    active: KeyField<T>
    direction: MatSortDirection
  },
};

export type FilterEventText = {
  type: 'text';
  value: string;
};
export type DateType = 'start' | 'end';
export type FilterEventDate = {
  type: `date-${DateType}`;
  value: DateTime | null;
};
export type FilterEvent = FilterEventText | FilterEventDate;

// export type SortDirection = {
//   [key in Exclude<MatSortDirection, ''>]: ArmonikSortDirection
// }

// TODO: Les filters fields sont les changes présents en base de données et s'il s'agit d'un type date, alors il faut pouvoir remplir un champs before et after (donc il va falloir créer plein de types (un peu à la notion) (mais il faut d'abord faire les types)
// TODO: Ajouter des commentaires sur l'utilisation des filtres
// Utilisé en dur dans le code pour associer un champ à un type
// export type TypeField = 'text' | 'number' | 'boolean' | 'date' | 'datetime' | 'time' | 'select' | 'multiselect';
export type FilterField<T extends object> = {
  field: KeyField<T>
  // TODO: Create a type from these values
  type: FilterInputType
  // Maybe, we could add an 'options' field to the IFilterField interfaces
};
