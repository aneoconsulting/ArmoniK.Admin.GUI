import { FilterDateOperator } from '@aneoconsultingfr/armonik.api.angular';
import { Filter, FilterInputValueDate } from '@app/types/filters';

/**
 * Since date filters are looking for days, there are some cases where we need to add a day in second to our object.
 * @param filter 
 * @returns the seconds in string
 */
export class DateHandlerService<T extends number, U extends number | null> {
  setSecondsByDateOperator(filter: Filter<T, U>): string {
    const seconds = (filter.value as FilterInputValueDate);
    if (!seconds) {
      return '0';
    }
    if (filter.operator === FilterDateOperator.FILTER_DATE_OPERATOR_AFTER || filter.operator === FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL) {
      return (seconds).toString();
    }
    return seconds.toString();
  }
}