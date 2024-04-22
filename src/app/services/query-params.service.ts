import { Injectable } from '@angular/core';
import { IndexListOptions } from '@app/types/data';
import { FilterInputValueDate, MaybeNull, RawFilters } from '@app/types/filters';
import { QueryParamsOptions } from '@app/types/query-params';

@Injectable()
export class QueryParamsService {
  createOptions<T extends IndexListOptions>(options: T): QueryParamsOptions {
    const queryParamsOptions: QueryParamsOptions = {
      pageIndex: options.pageIndex.toString(),
      pageSize: options.pageSize.toString(),
      sortField: options.sort.active.toString(),
      sortDirection: options.sort.direction,
    };

    return queryParamsOptions;
  }

  createFilters<F extends RawFilters>(filtersOr: F): Record<string, MaybeNull<string | number | FilterInputValueDate | boolean | null>> | null {
    const queryParamsFilters: Record<string, MaybeNull<string | number | FilterInputValueDate | boolean | null>> = {};

    let i = 0;
    for (const filtesrsAnd of filtersOr) {
      for (const filter of filtesrsAnd) {
        const key = `${i}-${filter.for}-${filter.field}-${filter.operator}`; // or-for-field-operator
        queryParamsFilters[key] = filter.value;
      }
      i++;
    }

    return queryParamsFilters;
  }
}
