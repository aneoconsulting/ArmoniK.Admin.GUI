import { FilterDateOperator, FilterStatusOperator, FilterStringOperator, TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TaskFilterDefinition } from '@app/tasks/types';
import { Filter } from '@app/types/filters';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  const service = new UtilsService<number, number>();

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

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('recoverType', () => {
    it('should recover filter type', () => {
      const statusTypeFilter: Filter<TaskSummaryEnumField, TaskOptionEnumField> = {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
        for: 'root',
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
        value: TaskStatus.TASK_STATUS_COMPLETED
      };
      expect(service.recoverType(statusTypeFilter, filterDefinitions)).toEqual('status');
    });

    it('should recover a string type for a custom field filter', () => {
      const customFilter: Filter<TaskSummaryEnumField, TaskOptionEnumField> = {
        field: 'custom.FastCompute',
        for: 'custom',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
        value: 'someValue'
      };
      expect(service.recoverType(customFilter, filterDefinitions)).toEqual('string');
    });
  });

  describe('recoverStatuses', () => {    
    it('Should return statuses in case of a filterDefinition status', () => {
      const correctStatusFilter: Filter<TaskSummaryEnumField, TaskOptionEnumField> = {
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
      const incorrectStatusFilter: Filter<TaskSummaryEnumField, TaskOptionEnumField> = {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_CONTAINS,
        value: 'someValue'
      };
      expect(() => {service.recoverStatuses(incorrectStatusFilter, filterDefinitions);})
        .toThrow('Filter definition is not a status');
    });
  });

  describe('recoverFilterDefinition', () => {
    it('should recover the type definition of a filter', () => {
      const correctStatusFilter: Filter<TaskSummaryEnumField, TaskOptionEnumField> = {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
        for: 'root',
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_EQUAL,
        value: 2
      };
      expect(service.recoverFilterDefinition(correctStatusFilter, filterDefinitions)).toEqual(filterDefinitions[0]);
    });

    it('should throw an error if there is no filter definition', () => {
      const notExistingFilterType: Filter<TaskSummaryEnumField, TaskOptionEnumField> = {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '1133400883'
      };
      expect(() => service.recoverFilterDefinition(notExistingFilterType, filterDefinitions))
        .toThrow(`Filter definition not found for field ${notExistingFilterType.field?.toString()}`);
    });
  });
});