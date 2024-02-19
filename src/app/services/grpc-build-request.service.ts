import { ApplicationFilterField, SortDirection as ArmoniKSortDirection, FilterArrayOperator, FilterDateOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, PartitionFilterField, ResultFilterField, SessionFilterField, TaskFilterField } from '@aneoconsultingfr/armonik.api.angular';
import { SortDirection } from '@angular/material/sort';
import { FiltersEnums, FiltersOptionsEnums } from '@app/dashboard/types';
import { Filter } from '@app/types/filters';

type FilterField = SessionFilterField.AsObject['field'] | TaskFilterField.AsObject['field'] | ApplicationFilterField.AsObject['field'] | PartitionFilterField.AsObject['field'] | ResultFilterField.AsObject['field'];

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
      value: Number(filter.value) ?? 0,
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