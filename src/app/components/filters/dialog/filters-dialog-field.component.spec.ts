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

  const registeredOnChange = jest.fn((val: string | TaskSummaryEnumField | TaskOptionEnumField | null) => val);
  const registeredOnTouche = jest.fn((val: string | TaskSummaryEnumField | TaskOptionEnumField | null) => val);

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        FitlersDialogFieldComponent,
        { provide: DataFilterService, useValue: mockDataFiltersService },
      ],
    }).inject(FitlersDialogFieldComponent<TaskSummaryEnumField, TaskOptionEnumField>);
    component.customProperties = customProperties;
    component.filter = filterForm;
    component.registerOnChange(registeredOnChange);
    component.registerOnTouched(registeredOnTouche);
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

  describe('writeValue', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(component.for, 'emit');
    });

    describe('with non custom property', () => {
      const value = 'TaskId';

      beforeEach(() => {
        component.writeValue(value);
      });

      it('should change the value', () => {
        expect(component.value).toEqual(value);
      });

      it('should emit the new "for" value for the filter', () => {
        expect(spy).toHaveBeenCalledWith('root');
      });
    });

    describe('With custom property', () => {
      const value = 'someProperty';

      beforeEach(() => {
        component.writeValue(value);
      });

      it('should change the value', () => {
        expect(component.value).toEqual(value);
      });

      it('should emit the new "for" value for the filter as "custom"', () => {
        expect(spy).toHaveBeenCalledWith('custom');
      });
    });

    it('should retrieve the label if the provided value is a number', () => {
      component.writeValue('1');
      expect(component.value).toEqual('Else');
    });
  });

  describe('retrieveLabel', () => {
    it('should retrieve the label', () => {
      component['retrieveLabel']({ for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID, type: 'string' });
      expect(mockDataFiltersService.retrieveLabel).toHaveBeenCalled();
    });

    it('should return an empty string when an error is catched', () => {
      mockDataFiltersService.retrieveLabel.mockImplementationOnce(() => {throw new Error();});
      expect(component['retrieveLabel']({ for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID, type: 'string' })).toEqual('');
    });
  });
});