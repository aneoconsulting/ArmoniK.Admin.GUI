import { Injectable } from '@angular/core';
import { Filter, KeyField } from '@app/types/data';

@Injectable()
export class UtilsService<T extends object> {
  findFilter(filters: Filter<T>[], field: KeyField<T>): Filter<T> | null {
    const filter = filters.find(f => f.field === field);

    if (!filter) {
      return null;
    }

    return filter;
  }

  convertFilterValue(filter: Filter<T> | null): string {
    if (!filter) {
      return '';
    }

    if (!filter.value) {
      return '';
    }

    return filter.value.toString();
  }

  convertFilterValueToNumber(filter: Filter<T> | null): number | null {
    if (!filter) {
      return null;
    }

    if (!filter.value) {
      return null;
    }

    const numberValue = Number(filter.value);

    if (Number.isNaN(numberValue)) {
      return null;
    }

    return numberValue;
  }
}
