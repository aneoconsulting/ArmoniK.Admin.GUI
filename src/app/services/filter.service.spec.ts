import { FilterArrayOperator, FilterBooleanOperator, FilterDateOperator, FilterDurationOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
import { ShowActionButton } from '@app/types/components/show';
import { FiltersService } from './filters.service';

describe('FiltersService', () => {
  const service = new FiltersService();

  describe('findOperators', () => {
    it('should return the filterStringOperators when "string" is provided', () => {
      expect(service.findOperators('string')).toBe(service.filterStringOperators);
    });

    it('should return the filterNumberOperators when "number" is provided', () => {
      expect(service.findOperators('number')).toBe(service.filterNumberOperators);
    });

    it('should return the filterDateOperators when "date" is provided', () => {
      expect(service.findOperators('date')).toBe(service.filterDateOperators);
    });

    it('should return the filterArrayOperators when "array" is provided', () => {
      expect(service.findOperators('array')).toBe(service.filterArrayOperators);
    });

    it('should return the filterStatusOperators when "status" is provided', () => {
      expect(service.findOperators('status')).toBe(service.filterStatusOperators);
    });

    it('should return the filterBooleanOperators when "boolean" is provided', () => {
      expect(service.findOperators('boolean')).toBe(service.filterBooleanOperators);
    });

    it('should return the filterDurationOperators when "duration" is provided', () => {
      expect(service.findOperators('duration')).toBe(service.filterDurationOperators);
    });
  });

  describe('createQueryParamsKey', () => {
    it('should return the correct string if a string filter operator is provided', () => {
      expect(service.createQueryParamsKey(1, 'my_string', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, 1))
        .toEqual('1-my_string-1-0');
      expect(service.createQueryParamsKey(1, 'my_string', FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS, 1))
        .toEqual('1-my_string-1-2');
    });

    it('should return the correct string if a number filter operator is provided', () => {
      expect(service.createQueryParamsKey(1, 'my_string', FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL, 1))
        .toEqual('1-my_string-1-0');
      expect(service.createQueryParamsKey(1, 'my_string', FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL, 1))
        .toEqual('1-my_string-1-4');
    });

    it('should return the correct string if a date filter operator is provided', () => {
      expect(service.createQueryParamsKey(1, 'my_string', FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE, 1))
        .toEqual('1-my_string-1-2');
      expect(service.createQueryParamsKey(1, 'my_string', FilterDateOperator.FILTER_DATE_OPERATOR_AFTER, 1))
        .toEqual('1-my_string-1-5');
    });

    it('should return the correct string if an array filter operator is provided', () => {
      expect(service.createQueryParamsKey(1, 'my_string', FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS, 1))
        .toEqual('1-my_string-1-0');
      expect(service.createQueryParamsKey(1, 'my_string', FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS, 1))
        .toEqual('1-my_string-1-1');
    });

    it('should return the correct string if a status filter operator is provided', () => {
      expect(service.createQueryParamsKey(1, 'my_string', FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL, 1))
        .toEqual('1-my_string-1-0');
      expect(service.createQueryParamsKey(1, 'my_string', FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL, 1))
        .toEqual('1-my_string-1-1');
    });

    it('should return the correct string if a boolean filter operator is provided', () => {
      expect(service.createQueryParamsKey(1, 'my_string', FilterBooleanOperator.FILTER_BOOLEAN_OPERATOR_IS, 1))
        .toEqual('1-my_string-1-0');
    });

    it('should return the correct string if a duration filter operator is provied', () => {
      expect(service.createQueryParamsKey(1, 'my_string', FilterDurationOperator.FILTER_DURATION_OPERATOR_EQUAL, 7))
        .toEqual('1-my_string-7-0');
    });
  });

  describe('createFilterQueryParams', () => {
    it('should return the crrect query params', () => {
      const id = 'sessionId';
      const actionsButton: ShowActionButton = {
        id: id,
        name: 'Session ID',
        link: '/tasks',
      };
      const key = '0-root-1-0';
      service.createFilterQueryParams([actionsButton], 'sessionId', key, id);
      expect(actionsButton.queryParams).toEqual({[key]: id});
    });
  });

  describe('createFilterPartitionQueryParams', () => {
    it('should return the correct query params', () => {
      const partitionIds = ['partition1', 'partition2', 'partition3'];
      expect(service.createFilterPartitionQueryParams(partitionIds)).toEqual({
        '0-root-1-0': 'partition1',
        '1-root-1-0': 'partition2',
        '2-root-1-0': 'partition3',
      });
    });
  });
});