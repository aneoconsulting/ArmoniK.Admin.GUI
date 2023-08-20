import { Injectable } from '@angular/core';
import { FilterInputValueDate, FiltersOr, MaybeNull } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { QueryParamsOptions } from '@app/types/query-params';

@Injectable()
export class QueryParamsService {
  createOptions<T extends object>(options: ListOptions<T>): QueryParamsOptions {
    const queryParamsOptions: QueryParamsOptions = {
      pageIndex: options.pageIndex.toString(),
      pageSize: options.pageSize.toString(),
      sortField: options.sort.active.toString(),
      sortDirection: options.sort.direction,
    };

    return queryParamsOptions;
  }

  createFilters<T extends number, U extends number | null = null>(filtersOr: FiltersOr<T, U>): Record<string, MaybeNull<string | number | FilterInputValueDate | null>> | null {
    const queryParamsFilters: Record<string, MaybeNull<string | number | FilterInputValueDate | null>> = {};

    let i = 0;
    for (const filtesrsAnd of filtersOr) {
      for (const filter of filtesrsAnd) {
        const key = `${i}-${filter.for}-${filter.field}-${filter.operator}`; // or-for-field-operator
        const value = filter.value;
        queryParamsFilters[key] = value;
      }
      i++;
    }

    return queryParamsFilters;
  }
}
