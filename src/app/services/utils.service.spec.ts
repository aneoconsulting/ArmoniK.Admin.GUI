import { FilterNumberOperator, FilterStatusOperator, FilterStringOperator, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TaskFilterDefinition } from '@app/tasks/types';
import { Filter, FilterType, FiltersAnd, FiltersOr } from '@app/types/filters';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  const service = new UtilsService<number, number>();
  
  const cb = (filter: Filter<number, number>) => {
    return (type: FilterType, field: number | null | string, isForRoot: boolean, isCustom: boolean) => {
      let filterField;
      if (isForRoot) {
        filterField = {
          taskSummaryField: {
            field: field as TaskSummaryEnumField
          }
        };
      } else if (isCustom) {
        filterField = {
          taskOptionCustomField: {
            field: field as unknown as string
          }
        };
      } else {
        filterField = {
          taskOptionField: {
            field: field as TaskOptionEnumField
          }
        };
      }
      return {
        field: filterField,
        filterString: {
          value: filter.value?.toString() ?? '',
          operator: filter.operator
        }
      };
    };
  };

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('createFilters', () => {
    const filtersAnd1: FiltersAnd<number, number> = [
      {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'myFirstFilterValue'
      },
      {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
        for: 'root',
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
        value: 1
      }
    ];

    const filtersAnd2: FiltersAnd<number, number> = [
      {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_TTL,
        for: 'root',
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL,
        value: 2
      },
      {
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
        for: 'options',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'someValue'
      }
    ];

    const filtersOr: FiltersOr<number, number> = [filtersAnd1, filtersAnd2];

    const filterDefinitions: TaskFilterDefinition[] = [
      {
        for: 'root',
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
        type: 'number'
      },
      {
        for: 'root',
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
        type: 'string',
      },
      {
        for: 'root',
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_HOSTNAME,
        type: 'string'
      },
      {
        for: 'root',
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_TTL,
        type: 'number'
      },
      {
        for: 'options',
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
        type: 'string'
      }
    ];
    const result = {
      or: [{and:
        [{
          field: {
            taskSummaryField: {
              field: 16
            }
          },
          filterString: {
            value: 'myFirstFilterValue',
            operator: 2
          }
        },
        {
          field: {
            taskSummaryField: {
              field: 1
            }
          },
          filterString: {
            value: '1',
            operator: 0
          }
        }]
      },
      {and: 
        [
          {
            field: {
              taskSummaryField: {
                field: 12
              }
            },
            filterString: {
              value: '2',
              operator: 4
            }
          },
          {
            field: {
              taskOptionField: {
                field: 5
              }
            },
            filterString: {
              value: 'someValue',
              operator: 2
            }
          }
        ]
      }]
    };

    it('Should create a FiltersOr with various filters', () => {
      expect(service.createFilters(filtersOr, filterDefinitions, cb)).toEqual(result);
    });

    it('Should not put a filter with null attributes in the FiltersOr', () => {
      const filtersAnd3: FiltersAnd<number, number> = [
        {
          field: null,
          for: 'root',
          operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL,
          value: 2
        },
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_PROCESSING_TO_END_DURATION,
          for: 'root',
          operator: null,
          value: 2
        },
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ACQUIRED_AT,
          for: 'root',
          operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN_OR_EQUAL,
          value: null
        },
      ];
      filtersOr.push(filtersAnd3);
      expect(service.createFilters(filtersOr, filterDefinitions, cb)).toEqual(result);
    });

    it('Should throw an error if its definitions are not in the filtersDefinition', () => {
      const filtersAnd3: FiltersAnd<number, number> = [
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
          for: 'options',
          operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN,
          value: 42
        }
      ];
      const filtersAnd4: FiltersAnd<number, number> = [
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
          for: 'root',
          operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
          value: 'someValue'
        }
      ];
      filtersOr.push(filtersAnd3);
      expect(() => {service.createFilters(filtersOr, filterDefinitions, cb);})
        .toThrowError('Filter definition not found for field 1');
      filtersOr.pop();
      filtersOr.push(filtersAnd4);
      expect(() => {service.createFilters(filtersOr, filterDefinitions, cb);})
        .toThrowError('Filter definition not found for field 2');
    });
  });

  describe('recoverStatuses', () => {
    const filterDefinitions: TaskFilterDefinition[] = [
      {
        type: 'status',
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
        for: 'root',
        statuses: [
          { key: 1, value: 'up' },
          { key: '2', value: 'down'}
        ]
      },
      {
        type: 'string',
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
        for: 'root'
      }
    ];
    
    it('Should return statuses in case of a filterDefinition status', () => {
      const correctStatusFilter: Filter<number, number> = {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
        for: 'root',
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
        value: 2
      };
      expect(service.recoverStatuses(correctStatusFilter, filterDefinitions))
        .toEqual([
          { key: 1, value: 'up' },
          { key: '2', value: 'down'}
        ]);
    });
    
    it('Should throw an error in case of a non-status filter', () => {
      const incorrectStatusFilter: Filter<number, number> = {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_CONTAINS,
        value: 'someValue'
      };
      expect(() => {service.recoverStatuses(incorrectStatusFilter, filterDefinitions);})
        .toThrowError('Filter definition is not a status');
    });
  });
});