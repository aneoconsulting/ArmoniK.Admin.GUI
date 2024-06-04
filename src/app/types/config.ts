export type ScopeConfig<C, O, F> = {
  interval: number;
  lockColumns: boolean;
  columns: C[];
  options: O;
  filters: F;
  showFilters: boolean;
};

export type CustomScope = 'sessions' | 'tasks';
export type Scope = 'applications' | 'partitions' | 'sessions' | 'results' | 'tasks';
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
  `${Scope}-show-filters`;

export type ExportedDefaultConfig = {
  [key in Key]: unknown;
};
