import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ColumnKey } from './data';
import { Filter, FilterField } from './filters';

export interface ColumnsModifyDialogData<T extends object, O extends object> {
  currentColumns: ColumnKey<T, O>[]
  availableColumns: ColumnKey<T, O>[]
  columnsLabels: Record<ColumnKey<T, O>, string>
}

export type ColumnsModifyDialogResult<T extends object, O extends object> = ColumnKey<T, O>[];

export interface FiltersDialogData<T extends object> {
  filters: Filter<T>[]
  availableFiltersFields: FilterField<T>[]
  columnsLabels: Record<ColumnKey<T>, string>
}

export interface AutoRefreshDialogData {
  value: number
}

// TODO: type this dialog with result

export type TaskStatusColored = {
  status: TaskStatus;
  color: string;
};

export interface ViewTasksByStatusDialogData {
  statusesCounts: TaskStatusColored[]
}
