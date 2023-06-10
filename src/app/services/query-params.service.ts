import { Injectable } from '@angular/core';
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
}
