import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey } from './data';
import { Filter, FilterField } from './filters';

// TODO: typed every dialog using data and response types
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

export type TaskStatusColored = {
  status: TaskStatus;
  color: string;
};

export interface ViewTasksByStatusDialogData {
  statusesCounts: TaskStatusColored[]
}
