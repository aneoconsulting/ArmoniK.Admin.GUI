import { Injectable } from '@angular/core';
import { Scope } from '@app/types/config';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';

/**
 * Cache the filters if they are too long to be put in a browser URL
 */
@Injectable()
export class FiltersCacheService {
  private readonly filtersMap = new Map<Scope, FiltersOr<FiltersEnums, FiltersOptionsEnums>>();

  /**
   * Cache filters value for a specified table
   * @param scope Table to apply filters to
   * @param filters Filters to cache
   */
  set<F extends FiltersEnums, FO extends FiltersOptionsEnums>(scope: Scope, filters: FiltersOr<F, FO>) {
    this.filtersMap.set(scope, filters);
  }

  /**
   * Returns the cached filters for the specified table and remove it.
   * @param scope Table to apply the filters to
   * @returns The cached filters or empty array [].
   */
  get<F extends FiltersEnums, FO extends FiltersOptionsEnums>(scope: Scope): FiltersOr<F, FO> | undefined {
    const filters = this.filtersMap.get(scope) as FiltersOr<F, FO> | undefined;
    if (filters) {
      this.delete(scope);
    }
    return filters;
  }

  /**
   * Remove filters from the cache.
   * @param scope 
   */
  delete(scope: Scope): void {
    this.filtersMap.delete(scope);
  }

  /**
   * Clear all cached filters
   */
  clear(): void {
    this.filtersMap.clear();
  }
}