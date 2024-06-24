import { Line, LineType } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, CustomColumn, RawColumnKey } from './data';
import { FiltersOr } from './filters';

export interface ColumnsModifyDialogData<T extends object, O extends object> {
  currentColumns: RawColumnKey[]
  availableColumns: RawColumnKey[]
  columnsLabels: Record<ColumnKey<T, O>, string>
}

export type ColumnsModifyDialogResult<T extends object, O extends object> = ColumnKey<T, O>[];

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
