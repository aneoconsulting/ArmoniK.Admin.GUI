import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilterDefinition, FilterFor } from '@app/sessions/services/sessions-filters.service';
import { Filter, FiltersOr } from '@app/types/filters';
import { QueryParamsOptionsKey } from '@app/types/query-params';

/**
 * Service to manage the URL for the table.
 * It's a low level service that should be used by the TableService.
 */
@Injectable()
export class TableURLService {
  constructor(private _route: ActivatedRoute) {}

  /**
   * Returns the wanted table options from the url.
   * @param key [QueryParamsOptionsKey](../types/query-params.ts)
   * @returns The wanted data, not parsed.
   */
  getQueryParamsOptions<T>(key: QueryParamsOptionsKey) {
    return this.getQueryParam<T>(key, false);
  }

  /**
   * Retrieve the filters specified in the filtersDefinition from the url.
   * @param filtersDefinitions [FilterDefinition](../sessions/services/sessions-filters.service.ts)
   * @returns an array of every wanted filter
   */
  getQueryParamsFilters<T extends number, U extends number | null>(filtersDefinitions: FilterDefinition<T, U>[]): FiltersOr<T, U> {
    const params: Map<string, Filter<T, U>[]>  = new Map();
    const filters: FiltersOr<T, U> = [];

    const extractValues = /(?<order>\d)-(?<for>.*)-(?<field>.*)-(?<operator>\d)/;
    const keys = this.getQueryParamKeys();

    for (const key of keys) {
      const match = key.match(extractValues);
      const order = match?.groups?.['order'] as string ?? null;
      const for_ = match?.groups?.['for'] as FilterFor<T, U> ?? null;
      const field = match?.groups?.['field'] ? Number(match?.groups?.['field']) : null as T | U | null;
      const operator = match?.groups?.['operator'] as string ?? null;

      if (order === null || field === null || operator === null || for_ === null) {
        continue;
      }

      const isInDefinition = filtersDefinitions.some(definition => definition.field === field && definition.for === for_);

      if (!isInDefinition) {
        console.log('Unknown filter', field);
        continue;
      }

      const currentParams = params.get(order) ?? [] as Filter<T, U>[];

      currentParams.push({
        field: field as T | U,
        operator: Number(operator),
        value: this.getQueryParam(key, false),
        for: for_ as FilterFor<T, U>
      });

      params.set(order, currentParams);
    }

    for (const [, value] of params) {
      filters.push(value);
    }

    return filters;
  }

  /**
   * @returns all the keys contained in the route. 
   */
  getQueryParamKeys(): string[] {
    return this._route.snapshot.queryParamMap.keys;
  }

  /**
   * Return a parameter from the route by its key.
   * @param key `string`, also in the route.
   * @param parse If you want your data to be parsed. Default = true
   * @returns the data
   */
  getQueryParam<T>(key: string, parse = true) {
    const data = this._route.snapshot.queryParamMap.get(key);

    if(data && parse) {
      return JSON.parse(data) as T;
    } else if (data) {
      return data as T;
    }

    return null;
  }
}
