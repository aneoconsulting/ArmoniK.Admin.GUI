import { Params } from '@angular/router';

export type QueryParamsOptions = {
  pageIndex: string;
  pageSize: string;
  sortField: string;
  sortDirection: string;
};
export type QueryParamsFilters = Params;

export type QueryParamsOptionsKey = keyof QueryParamsOptions;
export type QueryParamsFilterKey<T extends object> = keyof T;
