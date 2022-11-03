export type AppNavLink = {
  path: string | string[];
  label: string;
  queryParams?: Record<string, string | number | boolean>;
};
