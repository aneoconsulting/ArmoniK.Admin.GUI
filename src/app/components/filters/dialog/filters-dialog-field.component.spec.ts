import { FilterStringOperator, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomColumn } from '@app/types/data';
import { FilterFor } from '@app/types/filter-definition';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { FitlersDialogFieldComponent } from './filters-dialog-field.component';
import { FilterInputValue, FormFilterType } from './types';

describe('FitlersDialogFieldComponent', () => {
  let component: FitlersDialogFieldComponent<TaskSummaryEnumField, TaskOptionEnumField>;

  const mockDataFiltersService = {
    filtersDefinitions: [{
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
      type: 'string',
    }],
    retrieveLabel: jest.fn((_, value) => value === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID ? 'TaskId' : 'Else'),
    retrieveField: jest.fn((value): { for?: string; index?: number } => value === 'someProperty' ? { index: -1 } : {
      for: 'root',
      index: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
    }),
  };

  const filterForm = new FormGroup<FormFilterType<TaskSummaryEnumField, TaskOptionEnumField>>({
    field: new FormControl<TaskSummaryEnumField | TaskOptionEnumField | null>(TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID),
    for: new FormControl<FilterFor<TaskSummaryEnumField, TaskOptionEnumField> | null>('root'),
    operator: new FormControl<number | null>(FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH),
    value: new FormControl<FilterInputValue>('id'),
  });

  const customProperties: CustomColumn[] = ['options.options.someProperty'];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        FitlersDialogFieldComponent,
        { provide: DataFilterService, useValue: mockDataFiltersService },
      ],
    }).inject(FitlersDialogFieldComponent<TaskSummaryEnumField, TaskOptionEnumField>);
    component.customProperties = customProperties;
    component.filter = filterForm;
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should set the labels with the customs properties', () => {
      expect(component.labelledProperties).toEqual(['TaskId', 'someProperty']);
    });
  });

  describe('onChange', () => {
    describe('with non custom property', () => {
      const value = 'TaskId';

      beforeEach(() => {
        component.onChange(value);
      });

      it('should change the value', () => {
        expect(component.value).toEqual(value);
      });

      it('should change the values of the filter form', () => {
        expect(filterForm.value).toEqual({
          for: 'root',
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
          operator: null,
          value: 'id',
        });
      });

      it('should mark the form as dirty', () => {
        expect(filterForm.dirty).toBeTruthy();
      });
    });

    describe('With custom property', () => {
      const value = 'someProperty';

      beforeEach(() => {
        component.onChange(value);
      });

      it('should change the value', () => {
        expect(component.value).toEqual(value);
      });

      it('should change the values of the filter form', () => {
        expect(filterForm.value).toEqual({
          for: 'custom',
          field: value,
          operator: null,
          value: 'id',
        });
      });

      it('should mark the form as dirty', () => {
        expect(filterForm.dirty).toBeTruthy();
      });
    });
  });
});