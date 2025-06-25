import { TaskOptions } from '@app/tasks/types';
import { ColumnKey, DataRaw } from './data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from './filters';
import { ListOptions } from './options';

export type ScopeConfig<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends FiltersOptionsEnums | null = null> = {
  interval: number;
  lockColumns: boolean;
  columns: ColumnKey<T, O>[];
  options: ListOptions<T, O>;
  filters: FiltersOr<F, FO>;
  showFilters: boolean;
};

export type CustomScope = 'sessions' | 'tasks';
export type StatusScope = 'sessions' | 'results' | 'tasks';
export type Scope = 'applications' | 'partitions' | StatusScope;
export type Element = 'columns' | 'options' | 'filters' | 'interval' | 'lock-columns';

export type Key =
  'language' |
  'navigation-sidebar' |
  'navigation-sidebar-opened' |
  'navigation-theme' |
  'navigation-external-services' |
  'dashboard-lines'|
  'dashboard-split-lines' |
  'applications-tasks-by-status' |
  'sessions-tasks-by-status' |
  'partitions-tasks-by-status' |
  'tasks-view-in-logs' |
  `${CustomScope}-custom-columns` |
  `${Scope}-${Element}` |
  `${Scope}-show-filters` |
  `${StatusScope}-statuses`;

export type ExportedDefaultConfig = {
  [key in Key]: unknown;
};
