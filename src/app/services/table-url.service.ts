import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueryParamsFilterKey, QueryParamsOptionsKey } from '@app/types/query-params';

/**
 * Service to manage the URL for the table.
 * It's a low level service that should be used by the TableService.
 */
@Injectable()
export class TableURLService {
  constructor(private _route: ActivatedRoute) {}

  getQueryParamsOptions<T>(key: QueryParamsOptionsKey) {
    return this.getQueryParams<T>(key, false);
  }

  getQueryParamsFilters<T, U extends object>(key: QueryParamsFilterKey<U>) {
    return this.getQueryParams<T>(key.toString(), false);
  }

  getQueryParams<T>(key: string, parse = true) {
    const data = this._route.snapshot.queryParamMap.get(key);

    if(data && parse) {
      return JSON.parse(data) as T;
    } else if (data) {
      return data as T;
    }

    return null;
  }
}
