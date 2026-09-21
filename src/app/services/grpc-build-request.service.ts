import { ApplicationFilterField, SortDirection as ArmoniKSortDirection, FilterArrayOperator, FilterBooleanOperator, FilterDateOperator, FilterDurationOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, PartitionFilterField, ResultFilterField, SessionFilterField, TaskFilterField } from '@aneoconsultingfr/armonik.api.angular';
import { SortDirection } from '@angular/material/sort';
import { Filter, FilterInputValue, FiltersEnums, FiltersOptionsEnums } from '@app/types/filters';

export type FilterField = SessionFilterField.AsObject['field'] | TaskFilterField.AsObject['field'] | ApplicationFilterField.AsObject['field'] | PartitionFilterField.AsObject['field'] | ResultFilterField.AsObject['field'];

export const sortDirections: Record<SortDirection, ArmoniKSortDirection> = {
  'asc': ArmoniKSortDirection.SORT_DIRECTION_ASC,
  'desc': ArmoniKSortDirection.SORT_DIRECTION_DESC,
  '': ArmoniKSortDirection.SORT_DIRECTION_UNSPECIFIED
};


export function buildStringFilter(filterField: FilterField, filter: Filter<FiltersEnums, FiltersOptionsEnums>) {
  return {
    field: filterField,
    filterString: {
      value: filter.value?.toString() ?? '',
      operator: filter.operator ?? FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
    },
  };
}

export function buildDateFilter(filterField: FilterField, filter: Filter<FiltersEnums, FiltersOptionsEnums>) {
  return {
    field: filterField,
    filterDate: {
      value: {
        nanos: 0,
        seconds: filter.value?.toString() ?? '0'
      },
      operator: filter.operator ?? FilterDateOperator.FILTER_DATE_OPERATOR_EQUAL
    }
  }; 
}

export function buildStatusFilter(filterField: FilterField, filter: Filter<FiltersEnums, FiltersOptionsEnums>) {
  return {
    field: filterField,
    filterStatus: {
      value: Number.isNaN(Number(filter.value)) ? 0 : Number(filter.value),
      operator: filter.operator ?? FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
    }
  };
}

export function buildNumberFilter(filterField: FilterField, filter: Filter<FiltersEnums, FiltersOptionsEnums>) {
  return {
    field: filterField,
    filterNumber: {
      value: filter.value?.toString() ?? '',
      operator: filter.operator ?? FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
    }
  };
}

export function buildArrayFilter(filterField: FilterField, filter: Filter<FiltersEnums, FiltersOptionsEnums>) {
  return {
    field: filterField,
    filterArray: {
      value: filter.value?.toString() ?? '',
      operator: filter.operator ?? FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS
    }
  };
}

export function buildBooleanFilter(filterField: FilterField, filter: Filter<FiltersEnums, FiltersOptionsEnums>) {
  return {
    field: filterField,
    filterBoolean: {
      value: filter.value ?? false,
      operator: FilterBooleanOperator.FILTER_BOOLEAN_OPERATOR_IS,
    }
  };
}

/**
 * The value is expressed in seconds and may be fractional: 1.5 becomes 1s and 500000000ns.
 */
export function buildDurationFilter(filterField: FilterField, filter: Filter<FiltersEnums, FiltersOptionsEnums>) {
  return {
    field: filterField,
    filterDuration: {
      value: toProtobufSeconds(filter.value),
      operator: filter.operator ?? FilterDurationOperator.FILTER_DURATION_OPERATOR_EQUAL,
    }
  };
}

/**
 * Splits a possibly fractional number of seconds into the protobuf seconds/nanos pair. The server
 * honours nanos on both date and duration filters, which is what allows sub second boundaries.
 */
export function toProtobufSeconds(value: FilterInputValue) {
  const total = Number(value) || 0;
  const seconds = Math.floor(total);

  return {
    seconds: seconds.toString(),
    nanos: Math.min(999999999, Math.round((total - seconds) * 1e9)),
  };
}
