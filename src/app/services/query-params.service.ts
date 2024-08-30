import { TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { TaskOptions } from '@app/tasks/types';
import { DataRaw } from '@app/types/data';
import { FiltersEnums, FiltersOr, MaybeNull } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { QueryParamsOptions } from '@app/types/query-params';

@Injectable()
export class QueryParamsService {
  createOptions<T extends DataRaw, O extends TaskOptions | null = null>(options: ListOptions<T, O>): QueryParamsOptions {
    const queryParamsOptions: QueryParamsOptions = {
      pageIndex: options.pageIndex.toString(),
      pageSize: options.pageSize.toString(),
      sortField: options.sort.active.toString(),
      sortDirection: options.sort.direction,
    };

    return queryParamsOptions;
  }

  createFilters<F extends FiltersEnums, FO extends TaskOptionEnumField | null = null>(filtersOr: FiltersOr<F, FO>): Record<string, MaybeNull<string | number | Date | boolean | null>> | null {
    const queryParamsFilters: Record<string, MaybeNull<string | number | Date | boolean | null>> = {};

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
