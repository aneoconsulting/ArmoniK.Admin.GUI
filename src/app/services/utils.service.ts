import { Injectable } from '@angular/core';
import { FilterDefinition } from '@app/types/filter-definition';
import { Filter, FilterType, FilterValueOptions, FiltersAnd, FiltersOr } from '@app/types/filters';

@Injectable()
// Need to generalize SessionRawEnumField
export class UtilsService<T extends number, U extends number | null = null> {

  createFilters<F>(filters: FiltersOr<T, U>, filtersDefinitions: FilterDefinition<T, U>[], cb: (filter: Filter<T, U>) => (type: FilterType, field: T | U | null, isForRoot: boolean) => F) {
    const or = this.#createFiltersOr<F>(filters, filtersDefinitions, cb);

    return or;
  }

  /**
   * Used to create a group of lines (OR).
   */
  #createFiltersOr<F>(filters: FiltersOr<T, U>, filtersDefinitions: FilterDefinition<T, U>[], cb: (filter: Filter<T, U>) => (type: FilterType, field: T | U | null, isForRoot: boolean) => F) {
    const filtersOr = [];

    for (const filter of filters) {
      const filtersAnd = this.#createFiltersAnd<F>(filter, filtersDefinitions, cb);

      if (filtersAnd.and && filtersAnd.and.length > 0) {
        filtersOr.push(filtersAnd);
      }
    }

    return {
      or: filtersOr
    };
  }

  /**
   * Used to create a line of filters (AND).
   */
  #createFiltersAnd<F>(filters: FiltersAnd<T, U>, filtersDefinitions: FilterDefinition<T, U>[], cb: (filter: Filter<T, U>) => (type: FilterType, field: T | U | null, isForRoot: boolean) => F) {
    const filtersAnd = [];

    for (const filter of filters) {
      const filterField = this.#createFilterField<F>(filter, filtersDefinitions, cb(filter));

      if (filterField) {
        filtersAnd.push(filterField);
      }
    }

    return {
      and: filtersAnd
    };
  }

  /**
   * Used to define a filter field.
   */
  #createFilterField<F>(filter: Filter<T, U>, filtersDefinitions: FilterDefinition<T, U>[], cb: (type: FilterType, field: T | U | null, isForRoot: boolean) => F): F | null {
    if (filter.field === null || filter.value === null || filter.operator === null) {
      return null;
    }

    const type = this.recoverType(filter, filtersDefinitions);
    const field = this.#recoverField(filter, filtersDefinitions);

    return cb(type, field, this.#isForRoot(filter, filtersDefinitions));
  }

  /**
   * Recover the type of a filter definition using the filter.
   */
  recoverType(filter: Filter<T, U>, filtersDefinitions: FilterDefinition<T, U>[]): FilterType  {
    const filterDefinition = this.#recoverFilterDefinition(filter, filtersDefinitions);

    return filterDefinition.type;
  }

  /**
   * Recover statuses of a filter definition using the filter.
   */
  recoverStatuses(filter: Filter<T, U>, filtersDefinitions: FilterDefinition<T, U>[]): FilterValueOptions {
    const filterDefinition = this.#recoverFilterDefinition(filter, filtersDefinitions);

    if (filterDefinition.type !== 'status') {
      throw new Error('Filter definition is not a status');
    }

    return filterDefinition.statuses;
  }

  /**
   * Check if a filter is used for a root property of the table. 
   * @param filter 
   * @param filtersDefinitions 
   * @returns true if root, false if options
   */
  #isForRoot(filter: Filter<T, U>, filtersDefinitions: FilterDefinition<T, U>[]): boolean {
    return this.#recoverFilterDefinition(filter, filtersDefinitions).for === 'root';
  }

  /**
   * Recover the field of a filter definition using the filter.
   */
  #recoverField(filter: Filter<T, U>, filtersDefinitions: FilterDefinition<T, U>[]): T | U {
    const filterDefinition = this.#recoverFilterDefinition(filter, filtersDefinitions);

    return filterDefinition.field;
  }


  /**
   * Recover the filter definition using the filter field.
   */
  #recoverFilterDefinition(filter: Filter<T, U>, filtersDefinitions: FilterDefinition<T, U>[]): FilterDefinition<T, U> {
    const filterDefinition = filtersDefinitions.find(filterDefinition => filterDefinition.for === filter.for && filterDefinition.field === filter.field);

    if (!filterDefinition) {
      throw new Error(`Filter definition not found for field ${filter.field?.toString()}`);
    }

    return filterDefinition;
  }
}
