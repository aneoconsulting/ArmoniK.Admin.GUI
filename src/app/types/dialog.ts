import { Line, LineType } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from './column.type';
import { ColumnKey, CustomColumn, DataRaw } from './data';
import { FiltersOr } from './filters';
import { Status, StatusLabelColor } from './status';

export interface ColumnsModifyDialogData<T extends DataRaw, O extends TaskOptions | null = null> {
  currentColumns: ColumnKey<T, O>[]
  availableColumns: TableColumn<T, O>[],
  customColumns: CustomColumn[],
  columnsLabels: Record<ColumnKey<T, O>, string>
}

export type ColumnsModifyDialogResult<T extends DataRaw, O extends TaskOptions | null = null> = ColumnKey<T, O>[];

export interface FiltersDialogData<T extends number, U extends number | null = null> {
  filtersOr: FiltersOr<T, U>,
  customColumns?: CustomColumn[]
}

export type FiltersDialogResult<T extends number, U extends number | null = null> = FiltersOr<T, U>;

export interface AutoRefreshDialogData {
  value: number
}

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

export type AddLineDialogData = {
  name: string;
  type: LineType;
};

export type AddLineDialogResult = {
  name: string;
  type: LineType;
};

export type EditNameLineData = {
  name: string;
};

export type ReorganizeLinesDialogData = {
  lines: Line[];
};

export type ReorganizeLinesDialogResult = {
  lines: Line[];
};

export type SplitLinesDialogData = {
  columns: number;
};

export type SplitLinesDialogResult = {
  columns: number;
};

export type ManageViewInLogsDialogData = {
  serviceIcon: string | null;
  serviceName: string | null;
  urlTemplate: string | null;
};

export type ManageViewInLogsDialogResult = {
  serviceIcon: string;
  serviceName: string;
  urlTemplate: string;
};

export type StatusColorPickerDialogData<S extends Status> = {
  current: Record<S, StatusLabelColor>,
  default: Record<S, StatusLabelColor>,
  keys: S[],
}