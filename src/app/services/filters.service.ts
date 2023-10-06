import { FilterArrayOperator, FilterBooleanOperator, FilterDateOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { FilterOperators, FilterType } from '@app/types/filters';

@Injectable()
export class FiltersOperationService {
  readonly filterStringOperators: Record<FilterStringOperator, string> = {
    [FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL]: $localize`Equal`,
    [FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL]: $localize`Not Equal`,
    [FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS]: $localize`Contains`,
    [FilterStringOperator.FILTER_STRING_OPERATOR_NOT_CONTAINS]: $localize`Not Contains`,
    [FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH]: $localize`Starts With`,
    [FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH]: $localize`Ends With`,
  };

  readonly filterNumberOperators: Record<FilterNumberOperator, string> = {
    [FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL]: $localize`Equal`,
    [FilterNumberOperator.FILTER_NUMBER_OPERATOR_NOT_EQUAL]: $localize`Not Equal`,
    [FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN]: $localize`Less Than`,
    [FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN_OR_EQUAL]: $localize`Less Than or Equal`,
    [FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN]: $localize`Greater Than`,
    [FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL]: $localize`Greater Than or Equal`,
  };

  readonly filterDateOperators: Record<FilterDateOperator, string> = {
    [FilterDateOperator.FILTER_DATE_OPERATOR_EQUAL]: $localize`Equal`,
    [FilterDateOperator.FILTER_DATE_OPERATOR_NOT_EQUAL]: $localize`Not Equal`,
    [FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE]: $localize`Before`,
    [FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL]: $localize`Before or Equal`,
    [FilterDateOperator.FILTER_DATE_OPERATOR_AFTER]: $localize`After`,
    [FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL]: $localize`After or Equal`,
  };

  readonly filterArrayOperators: Record<FilterArrayOperator, string> = {
    [FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS]: $localize`Contains`,
    [FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS]: $localize`Not Contains`,
  };

  readonly filterBooleanOperators: Record<FilterBooleanOperator, string> = {
    [FilterBooleanOperator.FILTER_BOOLEAN_OPERATOR_IS]: $localize`Is`,
  };

  readonly filterStatusOperators: Record<FilterStatusOperator, string> = {
    [FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL]: $localize`Equal`,
    [FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL]: $localize`Not Equal`,
  };

  readonly filterOperators: Record<FilterType, Record<number, string>> = {
    'string': this.filterStringOperators,
    'number': this.filterNumberOperators,
    'date': this.filterDateOperators,
    'array': this.filterArrayOperators,
    'status': this.filterStatusOperators,
    'boolean': this.filterBooleanOperators,
  };

  findOperators(type: FilterType) {
    return this.filterOperators[type];
  }

  createQueryParamsKey<T extends number>(or: number, for_: string, operator: FilterOperators, field: T) {
    return `${or}-${for_}-${field}-${operator.toString()}`;
  }
}
