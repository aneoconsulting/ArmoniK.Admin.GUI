import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey } from './data';
import { FiltersOr } from './filters';

export interface ColumnsModifyDialogData<T extends object, O extends object> {
  currentColumns: ColumnKey<T, O>[]
  availableColumns: ColumnKey<T, O>[]
  columnsLabels: Record<ColumnKey<T, O>, string>
}

export type ColumnsModifyDialogResult<T extends object, O extends object> = ColumnKey<T, O>[];

export interface FiltersDialogData<T extends number, U extends number | null = null> {
  filtersOr: FiltersOr<T, U>
}

export type FiltersDialogResult<T extends number, U extends number | null = null> = FiltersOr<T, U>;

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

export type ViewTasksByStatusDialogResult = Record<string, never>;

export interface ViewObjectDialogData {
  title: string;
  object: TaskOptions;
}

export type ViewObjectDialogResult = Record<string, never>;

export interface ViewArrayDialogData {
  title: string;
  array: string[];
}

export type ViewArrayDialogResult = Record<string, never>;

export interface EditLineDialogData {
  name :string }
