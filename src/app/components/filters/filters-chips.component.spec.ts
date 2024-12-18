import { FilterDateOperator, FilterDurationOperator, FilterStatusOperator, FilterStringOperator, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FilterDefinition } from '@app/types/filter-definition';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { FiltersService } from '@services/filters.service';
import { UtilsService } from '@services/utils.service';
import { FiltersChipsComponent } from './filters-chips.component';

describe('FiltersChipsComponent', () => {
  let component: FiltersChipsComponent<number, number | null>;

  const labels = {
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID]: 'TaskId',
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS]: 'Status',
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT]: 'CreatedAt',
  } as Record<TaskSummaryEnumField, string>;

  const optionsLabels = {
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_DURATION]: 'Max Duration',
  } as Record<TaskOptionEnumField, string>;

  const filtersDefinitions: FilterDefinition<TaskSummaryEnumField, TaskOptionEnumField>[] = [
    {
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
      type: 'string',
      for: 'root'
    },
    {
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
      type: 'status',
      for: 'root',
      statuses: [
        {key: 'status1', value: 'dispatched'},
        {key: 'status2', value: 'completed'}
      ]
    },
    {
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_DURATION,
      type: 'duration',
      for: 'options'
    },
    {
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT,
      type: 'date',
      for: 'root'
    }
  ];

  const mockDataFilterService = {
    filtersDefinitions: filtersDefinitions,
    retrieveLabel: jest.fn((for_: string, field: TaskSummaryEnumField | TaskOptionEnumField) => {
      if (for_ === 'root') {
        return labels[field as TaskSummaryEnumField];
      } else {
        return optionsLabels[field as TaskOptionEnumField];
      }
    })
  };

  beforeAll(() => {
    component = TestBed.configureTestingModule({
      providers: [
        FiltersChipsComponent,
        FiltersService,
        UtilsService,
        { provide: DataFilterService, useValue: mockDataFilterService }
      ]
    }).inject(FiltersChipsComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Filters cases', () => {
    it('should create the label of a filter', () => {
      component.filtersAnd = [{
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: '0',
      }];
      expect(component.filters()).toEqual(['TaskId Equal 0']);
    });
  
    it('should create the label of a status filter', () => {
      component.filtersAnd = [{
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
        for: 'root',
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL,
        value: 'status1',
      }];
      expect(component.filters()).toEqual(['Status Not Equal dispatched']);
    });
  
    it('should create the label of a date filter', () => {
      component.filtersAnd = [{
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '0',
      }];
      expect(component.filters()).toEqual(['CreatedAt After or Equal Thu, 01 Jan 1970 00:00:00 GMT']);
    });
  
    it('should create the label of a duration filter', () => {
      component.filtersAnd = [{
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_DURATION,
        for: 'options',
        operator: FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN_OR_EQUAL,
        value: '94350',
      }];
      expect(component.filters()).toEqual(['Max Duration Longer or Equal 26h 12m 30s']);
    });
  
    it('should create the label of a custom filter', () => {
      component.filtersAnd = [{
        field: 'CustomField',
        for: 'custom',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
        value: 'a'
      }];
      expect(component.filters()).toEqual(['CustomField Contains a']);
    });
  });

  describe('Error cases', () => {
    it('should create the label if there is no field', () => {
      component.filtersAnd = [{
        field: null,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL,
        value: 'abc'
      }];
      expect(component.filters()).toEqual(['No field']);
    });

    it('should create the label if there is no operator', () => {
      component.filtersAnd = [{
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
        for: 'root',
        operator: null,
        value: 'a'
      }];
      expect(component.filters()).toEqual(['No operator']);
    });

    it('should create the label if there is no value', () => {
      component.filtersAnd = [{
        field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_DURATION,
        for: 'options',
        operator: FilterDurationOperator.FILTER_DURATION_OPERATOR_EQUAL,
        value: null
      }];
      expect(component.filters()).toEqual(['Max Duration has no value']);
    });

    it('should create the label if the field is invalid', () => {
      component.filtersAnd = [{
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_FETCHED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE_OR_EQUAL,
        value: '12349000'
      }];
      expect(component.filters()).toEqual(['Invalid Filter Field']);
    });
  });
});