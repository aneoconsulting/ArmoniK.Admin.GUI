import { FilterArrayOperator, FilterBooleanOperator, FilterDateOperator, FilterNumberOperator, FilterStatusOperator, FilterStringOperator, SessionRawEnumField, SessionStatus, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Filter } from '@app/types/filters';
import { FilterField, buildArrayFilter, buildBooleanFilter, buildDateFilter, buildNumberFilter, buildStatusFilter, buildStringFilter } from './grpc-build-request.service';

describe('GrpcBuildRequestService', () => {
  describe('buildStringFilter', () => {
    const filterField: FilterField = {
      sessionRawField: {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID
      }
    };

    it('should build a string filter', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
        for: 'options',
        value: 'test'
      };

      expect(buildStringFilter(filterField, filter)).toEqual({
        field: filterField,
        filterString: {
          value: filter.value,
          operator: filter.operator,
        }
      });
    });

    it('should build a filter with default values', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
        operator: null,
        for: 'options',
        value: null
      };

      expect(buildStringFilter(filterField, filter)).toEqual({
        field: filterField,
        filterString: {
          value: '',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        }
      });
    });
  });

  describe('buildDateFilter', () => {
    const filterField: FilterField = {
      sessionRawField: {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT
      }
    };
  
    it('should build a date filter', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL,
        for: 'root',
        value: new Date('123456')
      };

      expect(buildDateFilter(filterField, filter)).toEqual({
        field: filterField,
        filterDate: {
          value: {
            nanos: 0,
            seconds: filter.value?.toString()
          },
          operator: filter.operator,
        }
      });
    });

    it('should build a filter with default values', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
        operator: null,
        for: 'root',
        value: null
      };

      expect(buildDateFilter(filterField, filter)).toEqual({
        field: filterField,
        filterDate: {
          value: {
            nanos: 0,
            seconds: '0'
          },
          operator: FilterDateOperator.FILTER_DATE_OPERATOR_EQUAL,
        }
      });
    });
  });

  describe('buildStatusFilter', () => {
    const filterField: FilterField = {
      sessionRawField: {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS
      }
    };

    it('should build a status filter', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL,
        for: 'options',
        value: SessionStatus.SESSION_STATUS_RUNNING
      };

      expect(buildStatusFilter(filterField, filter)).toEqual({
        field: filterField,
        filterStatus: {
          value: filter.value,
          operator: filter.operator,
        }
      });
    });

    it('should build a filter with default values', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
        operator: null,
        for: 'options',
        value: NaN
      };

      expect(buildStatusFilter(filterField, filter)).toEqual({
        field: filterField,
        filterStatus: {
          value: 0,
          operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
        }
      });
    });
  });

  describe('buildNumberFilter', () => {
    const filterField: FilterField = {
      sessionRawField: {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DURATION
      }
    };

    it('should build a number filter', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DURATION,
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL,
        for: 'options',
        value: 123456
      };

      expect(buildNumberFilter(filterField, filter)).toEqual({
        field: filterField,
        filterNumber: {
          value: `${filter.value}`,
          operator: filter.operator,
        }
      });
    });

    it('should build a filter with default values', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DURATION,
        operator: null,
        for: 'options',
        value: null
      };

      expect(buildNumberFilter(filterField, filter)).toEqual({
        field: filterField,
        filterNumber: {
          value: '',
          operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
        }
      });
    });
  });

  describe('buildArrayFilter', () => {
    const filterField: FilterField = {
      sessionRawField: {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS
      }
    };

    it('should build an array filter', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS,
        operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS,
        for: 'options',
        value: 'test'
      };

      expect(buildArrayFilter(filterField, filter)).toEqual({
        field: filterField,
        filterArray: {
          value: filter.value,
          operator: filter.operator,
        }
      });
    });

    it('should build a filter with default values', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS,
        operator: null,
        for: 'options',
        value: null
      };

      expect(buildArrayFilter(filterField, filter)).toEqual({
        field: filterField,
        filterArray: {
          value: '',
          operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_CONTAINS,
        }
      });
    });
  });

  describe('buildBooleanFilter', () => {
    const filterField: FilterField = {
      sessionRawField: {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_WORKER_SUBMISSION
      }
    };

    it('should build a boolean filter', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_WORKER_SUBMISSION,
        operator: FilterBooleanOperator.FILTER_BOOLEAN_OPERATOR_IS,
        for: 'options',
        value: true
      };

      expect(buildBooleanFilter(filterField, filter)).toEqual({
        field: filterField,
        filterBoolean: {
          value: filter.value,
          operator: filter.operator,
        }
      });
    });

    it('should build a filter with default values', () => {
      const filter: Filter<SessionRawEnumField, TaskOptionEnumField> = {
        field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_WORKER_SUBMISSION,
        operator: null,
        for: 'options',
        value: null
      };

      expect(buildBooleanFilter(filterField, filter)).toEqual({
        field: filterField,
        filterBoolean: {
          value: false,
          operator: FilterBooleanOperator.FILTER_BOOLEAN_OPERATOR_IS,
        }
      });
    });
  });
});