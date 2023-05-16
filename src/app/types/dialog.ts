import { ColumnKey } from './data';
import { Filter, FilterField } from './filters';

export interface ColumnsModifyDialogData<T extends object> {
  currentColumns: ColumnKey<T>[]
  availableColumns: ColumnKey<T>[]
}

export interface FiltersDialogData<T extends object> {
  filters: Filter<T>[]
  availableFiltersFields: FilterField<T>[]
}

export interface AutoRefreshDialogData {
  value: number
}
