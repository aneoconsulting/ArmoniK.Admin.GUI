import { TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { TaskOptions } from '@app/tasks/types';
import { DataRaw } from '@app/types/data';
import { FiltersEnums, FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { QueryParamsService } from './query-params.service';

@Injectable()
export class ShareUrlService {
  #window = inject(Window);
  #queryParamsService = inject(QueryParamsService);

  generateSharableURL<T extends DataRaw, F extends FiltersEnums, O extends TaskOptions | null = null, FO extends TaskOptionEnumField | null = null>(options: ListOptions<T, O> | null, filters: FiltersOr<F, FO> | null): string {
    const origin = this.#window.location.origin;
    const pathname = this.#window.location.pathname;

    if (!options && !filters) {
      return `${origin}${pathname}`;
    }

    const queryParamsOptions = options ? this.#queryParamsService.createOptions<T, O>(options) : null;
    const queryParamsFilters = filters ? this.#queryParamsService.createFilters<F, FO>(filters) : null;

    let queryParams = [this.#stringify(queryParamsOptions), this.#stringify(queryParamsFilters)].join('&');

    if (queryParams.at(0) === '&') queryParams = queryParams.substring(1);
    if (queryParams.at(-1) === '&') queryParams = queryParams.slice(0, -1);

    return `${origin}${pathname}?${queryParams}`;
  }

  #stringify(object: Record<string, unknown> | null): string {
    if (!object) {
      return '';
    }

    const keys = Object.keys(object);

    return keys.reduce((acc, key) => {
      const value = object[key];

      if (!value)
        return acc;

      if (acc === '')
        return `${key}=${value}`;

      return `${acc}&${key}=${value}`;
    }, '');
  }
}
