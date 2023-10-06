import { FilterValueOptions, FiltersAnd } from '@app/types/filters';
/**
 *
 * `for` and `field` are used to identify the filter.
 */
export type FilterDefinitionRootString<T extends number> = {
  for: 'root';
  field: T;
  type: 'string'
};
  
/**
   *
   * `for` and `field` are used to identify the filter.
   */
export type FilterDefinitionRootNumber<T extends number> = {
  for: 'root';
  field: T;
  type: 'number'
};
  
/**
   *
   * `for` and `field` are used to identify the filter.
   */
export type FilterDefinitionRootArray<T extends number> = {
  /**
     * Used to know which field comes from since it's just a number from an enum.
     */
  for: 'root';
  field: T;
  type: 'array';
};
  
/**
   *
   * `for` and `field` are used to identify the filter.
   */
export type FilterDefinitionRootStatus<T extends number> = {
  /**
     * Used to know which field comes from since it's just a number from an enum.
     */
  for: 'root';
  field: T;
  type: 'status';
  statuses: FilterValueOptions;
};
  
  
  

export type FilterDefinitionRoot<T extends number> = FilterDefinitionRootString<T> | FilterDefinitionRootNumber<T> | FilterDefinitionRootArray<T> | FilterDefinitionRootStatus<T>;

export type FilterDefinitionTaskOptionString<T extends number | null> = {
  /**
   * Used to know which field comes from since it's just a number from an enum.
   */
  for: 'options';
  field: T;
  type: 'string';
};


export type FilterDefinitionTaskOption<T extends number | null> = FilterDefinitionTaskOptionString<T>;

export type FilterDefinition<T extends number, U extends number | null = null> = FilterDefinitionRoot<T> | FilterDefinitionTaskOption<U>;

export type FilterFor<T extends number, U extends number | null = null> = FilterDefinition<T, U>['for'];



export abstract class FiltersServiceDefinition {
  abstract retrieveFiltersDefinitions<T extends number, U extends number | null = null>(): FilterDefinition<T, U>[];
  abstract retrieveLabel<T extends number, U extends number | null = null>(filterFor: FilterFor<T, U>, filterField: T | U): string;
  abstract saveFilters<T extends number, U extends number | null = null>(filters: FiltersAnd<T, U>[]): void;
  abstract restoreFilters<T extends number, U extends number | null = null>(): FiltersAnd<T, U>[];
  abstract resetFilters<T extends number, U extends number | null = null>(): FiltersAnd<T, U>[];
}