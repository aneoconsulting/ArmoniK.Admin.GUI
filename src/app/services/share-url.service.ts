import { Injectable, inject } from '@angular/core';
import { Filter } from '@app/types/filters';
import { ListOptions } from '@app/types/options';

@Injectable()
export class ShareUrlService {
  #window = inject(Window);

  generateSharableURL<T extends object>(options: ListOptions<T> | null, filters: Filter<T>[] | null): string {
    const origin = this.#window.location.origin;
    const pathname = this.#window.location.pathname;

    if (!options && !filters) {
      return `${origin}${pathname}`;
    }

    const optionsQuery = options ? `options=${encodeURIComponent(JSON.stringify(options))}` : '';
    const filtersQuery = filters ? `filters=${encodeURIComponent(JSON.stringify(filters))}` : '';
    const query = `?${optionsQuery}&${filtersQuery}`;

    return `${origin}${pathname}${query}`;
  }

}
