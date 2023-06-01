import { ColumnKey } from './data';
import { Filter, FilterField } from './filters';

export interface ColumnsModifyDialogData<T extends object> {
  currentColumns: ColumnKey<T>[]
  availableColumns: ColumnKey<T>[]
  columnsLabels: Record<ColumnKey<T>, string>
}

export interface FiltersDialogData<T extends object> {
  filters: Filter<T>[]
  availableFiltersFields: FilterField<T>[]
  columnsLabels: Record<ColumnKey<T>, string>
}

export interface AutoRefreshDialogData {
  value: number
}
