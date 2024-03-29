export type ScopeConfig<C, O, F> = {
  interval: number;
  lockColumns: boolean;
  columns: C[];
  options: O;
  filters: F;
};

export type CustomScope = 'sessions' | 'tasks';
export type Scope = 'applications' | 'partitions' | 'sessions' | 'results' | 'tasks';
export type Element = 'columns' | 'options' | 'filters' | 'interval' | 'lock-columns';

export type Key =
  'language' |
  'navigation-sidebar' |
  'navigation-theme' |
  'navigation-external-services' |
  'dashboard-lines'|
  'dashboard-split-lines' |
  'applications-tasks-by-status' |
  'sessions-tasks-by-status' |
  'partitions-tasks-by-status' |
  'tasks-view-in-logs' |
  'healthcheck-interval' |
  `${CustomScope}-custom-columns` |
  `${Scope}-${Element}`;

export type ExportedDefaultConfig = {
  [key in Key]: unknown;
};
