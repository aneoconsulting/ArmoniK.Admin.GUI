import { Injectable, inject } from '@angular/core';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { QueryParamsService } from './query-params.service';

@Injectable()
export class ShareUrlService {
  #window = inject(Window);
  #queryParamsService = inject(QueryParamsService);

  generateSharableURL<T extends object, U extends number, K extends number | null = null>(options: ListOptions<T> | null, filters: FiltersOr<U, K> | null): string {
    const origin = this.#window.location.origin;
    const pathname = this.#window.location.pathname;

    if (!options && !filters) {
      return `${origin}${pathname}`;
    }

    const queryParamsOptions = options ? this.#queryParamsService.createOptions<T>(options) : null;
    const queryParamsFilters = filters ? this.#queryParamsService.createFilters<U, K>(filters) : null;

    const queryParams = [this.#stringify(queryParamsOptions), this.#stringify(queryParamsFilters)].join('&');

    return `${origin}${pathname}?${queryParams}`;
  }

  #stringify(object: Record<string, unknown> | null): string {
    if (!object) {
      return '';
    }

    const keys = Object.keys(object);

    return keys.reduce((acc, key) => {
      const value = object[key];
      // const encodedValue = encodeURIComponent(JSON.stringify(value));

      if (!value)
        return acc;

      if (acc === '')
        return `${key}=${value}`;

      return `${acc}&${key}=${value}`;
    }, '');
  }
}
