import { Injectable } from '@angular/core';
import { Filter } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { QueryParamsOptions } from '@app/types/query-params';

@Injectable()
export class QueryParamsService<T extends object> {
  createOptions(options: ListOptions<T>): QueryParamsOptions {
    const queryParamsOptions: QueryParamsOptions = {
      pageIndex: options.pageIndex.toString(),
      pageSize: options.pageSize.toString(),
      sortField: options.sort.active.toString(),
      sortDirection: options.sort.direction,
    };

    return queryParamsOptions;
  }

  createFilters(filters: Filter<T>[]): Record<string, string> {
    const flattenFilters: Record<string, string> = {};

    for (const filter of filters) {
      const filterKey = filter.field;
      const filterValue = filter.value;

      if (!filterKey || !filterValue) {
        continue;
      }

      flattenFilters[filterKey.toString()] = filterValue.toString();
    }

    return flattenFilters;
  }
}
