export type ScopeConfig<C, O, F> = {
  interval: number;
  columns: C[];
  options: O;
  filters: F;
};

export type Scope = 'applications' | 'partitions' | 'sessions' | 'results' | 'tasks';
export type Element = 'columns' | 'options' | 'filters' | 'interval';

export type Key =
  'navigation-sidebar' |
  'navigation-theme' |
  'navigation-external-services' |
  'dashboard-status-groups' |
  'dashboard-interval' |
  'dashboard-hide-groups-headers' |
  'applications-tasks-by-status' |
  'sessions-tasks-by-status' |
  'partitions-tasks-by-status' |
  `${Scope}-${Element}`;

export type ExportedDefaultConfig = {
  [key in Key]: unknown;
};
