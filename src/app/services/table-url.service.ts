import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Filter, FilterField } from '@app/types/filters';
import { QueryParamsOptionsKey } from '@app/types/query-params';

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

  getQueryParamsFilters<T extends object>(availableFiltersFields: FilterField<T>[]): Filter<T>[] {
    const params: Filter<T>[] = [];

    for (const filter of availableFiltersFields) {
      const key = filter.field;
      const value = this.getQueryParams<string>(key.toString(), false);

      if (value) {
        switch (filter.type) {
        case 'text':
          params.push({ field: key, value });
          break;
        case 'number':
          params.push({ field: key, value: Number(value) });
          break;
        case 'date':
          throw new Error('Not implemented');
        case 'select': {
          const isFound = filter.options.some(option => option.value === value);
          if (isFound) {
            params.push({ field: key, value });
          }
          break;
        }
        default:
          this.#unreachable(filter);
        }
      }
    }

    return params;
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

  #unreachable(x: never): never {
    throw new Error('Unreachable ' + x);
  }
}
