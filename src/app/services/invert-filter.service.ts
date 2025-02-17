import { FilterArrayOperator, FilterDateOperator, FilterDurationOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
import { inject, Injectable } from '@angular/core';
import { Filter, FilterOperators, FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { DataFilterService } from '@app/types/services/data-filter.service';

@Injectable()
export class InvertFilterService<F extends FiltersEnums, FO extends FiltersOptionsEnums | null = null> {
  private readonly dataFilterService = inject(DataFilterService<F, FO>);

  private readonly emptyFilter: Filter<F, FO> = {
    for: null,
    field: null,
    operator: null,
    value: null,
  };

  invert(filters: FiltersOr<F, FO>): FiltersOr<F, FO> {
    let invertedFilters: FiltersOr<F, FO> = [];
    
    filters.forEach((filterAnd) => {
      if (invertedFilters.length === 0) {
        invertedFilters.push(...filterAnd.map((filter) => [this.invertFilter(filter)]));
      } else {
        invertedFilters = invertedFilters
          .map((invertedAnd) => filterAnd.map((filter) => [...invertedAnd, this.invertFilter(filter)]))
          .reduce((acc, current) => [...acc, ...current]);
      }
    });
    return invertedFilters;

  }

  private invertFilter(filter: Filter<F, FO>) {
    const type = this.dataFilterService.getType(filter);
    switch (type) {
    case 'string':
      return this.invertStringFilter(filter);
    case 'number':
      return this.invertNumberFilter(filter);
    case 'array':
      return this.invertArrayFilter(filter);
    case 'boolean':
      return this.invertBooleanFilter(filter);
    case 'date':
      return this.invertDateFilter(filter);
    case 'duration':
      return this.invertDurationFilter(filter);
    case 'status':
      return this.invertStatusFilter(filter);
    default:
      return {
        ...this.emptyFilter
      };
    }
  }

  private updateOperator(filter: Filter<F, FO>, operator: FilterOperators): Filter<F, FO> {
    return {
      ...filter,
      operator
    };
  }
  
  private invertStringFilter(filter: Filter<F, FO>) {
    switch(filter.operator) {
    case FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS:
      return this.updateOperator(filter, FilterStringOperator.FILTER_STRING_OPERATOR_NOT_CONTAINS);
    case FilterStringOperator.FILTER_STRING_OPERATOR_NOT_CONTAINS:
      return this.updateOperator(filter, FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS);
    case FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL:
      return this.updateOperator(filter, FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL);
    case FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL:
      return this.updateOperator(filter, FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL);
    default: 
      return {
        ...this.emptyFilter
      };
    }
  }

  private invertNumberFilter(filter: Filter<F, FO>) {
    switch(filter.operator) {
    case FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL:
      return this.updateOperator(filter, FilterNumberOperator.FILTER_NUMBER_OPERATOR_NOT_EQUAL);
    case FilterNumberOperator.FILTER_NUMBER_OPERATOR_NOT_EQUAL:
      return this.updateOperator(filter, FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL);
    case FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN:
      return this.updateOperator(filter, FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN_OR_EQUAL);
    case FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL:
      return this.updateOperator(filter, FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN);
    case FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN:
      return this.updateOperator(filter, FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL);
    case FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN_OR_EQUAL:
      return this.updateOperator(filter, FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN);
    default: 
      return {
        ...this.emptyFilter
      };
    }
  }

  private invertDateFilter(filter: Filter<F, FO>) {
    switch(filter.operator) {
    case FilterDateOperator.FILTER_DATE_OPERATOR_EQUAL:
      return this.updateOperator(filter, FilterDateOperator.FILTER_DATE_OPERATOR_NOT_EQUAL);
    case FilterDateOperator.FILTER_DATE_OPERATOR_NOT_EQUAL:
      return this.updateOperator(filter, FilterDateOperator.FILTER_DATE_OPERATOR_EQUAL);
    case FilterDateOperator.FILTER_DATE_OPERATOR_AFTER:
      return this.updateOperator(filter, FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL);
    case FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL:
      return this.updateOperator(filter, FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE);
    case FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE:
      return this.updateOperator(filter, FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL);
    case FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL:
      return this.updateOperator(filter, FilterDateOperator.FILTER_DATE_OPERATOR_AFTER);
    default: 
      return {
        ...this.emptyFilter
      }; 
    }
  }

  private invertArrayFilter(filter: Filter<F, FO>) {
    switch(filter.operator as FilterArrayOperator) {
    case FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS:
      return this.updateOperator(filter, FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS);
    case FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS:
      return this.updateOperator(filter, FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS);
    default:
      return {
        ...this.emptyFilter
      };
    }
  }

  private invertStatusFilter(filter: Filter<F, FO>) {
    switch(filter.operator as FilterStatusOperator) {
    case FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL:
      return this.updateOperator(filter, FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL);
    case FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL:
      return this.updateOperator(filter, FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL);
    default:
      return {
        ...this.emptyFilter
      };
    }
  }

  private invertBooleanFilter(filter: Filter<F, FO>) {
    return {
      ...filter,
      value: !filter.value
    };
  }

  private invertDurationFilter(filter: Filter<F, FO>) {
    switch(filter.operator as FilterDurationOperator) {
    case FilterDurationOperator.FILTER_DURATION_OPERATOR_EQUAL:
      return this.updateOperator(filter, FilterDurationOperator.FILTER_DURATION_OPERATOR_NOT_EQUAL);
    case FilterDurationOperator.FILTER_DURATION_OPERATOR_NOT_EQUAL:
      return this.updateOperator(filter, FilterDurationOperator.FILTER_DURATION_OPERATOR_EQUAL);
    case FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN:
      return this.updateOperator(filter, FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN_OR_EQUAL);
    case FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN_OR_EQUAL:
      return this.updateOperator(filter, FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN);
    case FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN:
      return this.updateOperator(filter, FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN_OR_EQUAL);
    case FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN_OR_EQUAL:
      return this.updateOperator(filter, FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN);
    default:
      return {
        ...this.emptyFilter
      };
    }
  }
}