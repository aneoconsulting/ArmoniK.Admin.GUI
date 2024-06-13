import { Injectable } from '@angular/core';
import { FiltersEnums, FiltersOptionsEnums } from '@app/dashboard/types';
import { FilterDefinition } from '@app/types/filter-definition';
import { Filter, FilterType, FilterValueOptions } from '@app/types/filters';

@Injectable()
export class UtilsService<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> {
  /**
   * Recover the type of a filter definition using the filter.
   */
  recoverType(filter: Filter<F, FO>, filtersDefinitions: FilterDefinition<F, FO>[]): FilterType {
    if (filter.for === 'custom') {
      return 'string';
    }
    const filterDefinition = this.recoverFilterDefinition(filter, filtersDefinitions);
  
    return filterDefinition.type;
  }
  
  /**
     * Recover statuses of a filter definition using the filter.
     */
  recoverStatuses(filter: Filter<F, FO>, filtersDefinitions: FilterDefinition<F, FO>[]): FilterValueOptions {
    const filterDefinition = this.recoverFilterDefinition(filter, filtersDefinitions);
  
    if (filterDefinition.type !== 'status') {
      throw new Error('Filter definition is not a status');
    }
  
    return filterDefinition.statuses;
  }

  /**
   * Recover the filter definition using the filter field.
   */
  recoverFilterDefinition(filter: Filter<F, FO>, filtersDefinitions: FilterDefinition<F, FO>[]): FilterDefinition<F, FO> {
    const filterDefinition = filtersDefinitions.find(filterDefinition => filterDefinition.for === filter.for && filterDefinition.field === filter.field);
  
    if (!filterDefinition) {
      throw new Error(`Filter definition not found for field ${filter.field?.toString()}`);
    }
  
    return filterDefinition;
  }
}