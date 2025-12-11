import { FilterStringOperator, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomColumn } from '@app/types/data';
import { FilterFor } from '@app/types/filter-definition';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { FiltersDialogFieldComponent } from './filters-dialog-field.component';
import { FilterInputValue, FormFilterType } from './types';

describe('FiltersDialogFieldComponent', () => {
  let component: FiltersDialogFieldComponent<TaskSummaryEnumField, TaskOptionEnumField>;

  const mockDataFiltersService = {
    filtersDefinitions: [{
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
      type: 'string',
    }],
    retrieveLabel: jest.fn((_, value) => value === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID ? 'TaskId' : 'Else'),
    retrieveField: jest.fn((value): { for?: string; index?: number } | undefined => 
      value === 'someProperty' ? undefined : {
        for: 'root',
        index: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
      }
    ),
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
        FiltersDialogFieldComponent,
        { provide: DataFilterService, useValue: mockDataFiltersService },
      ],
    }).inject(FiltersDialogFieldComponent<TaskSummaryEnumField, TaskOptionEnumField>);
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

    describe('With numbered string property', () => {
      const value = '1';

      it('should set the component value as the label corresponding to the value (in this case, Else)', () => {
        component.writeValue(value);
        expect(component.value).toEqual('Else');
      });

      it('should not emit the for event', () => {
        expect(spy).not.toHaveBeenCalled();
      });

      it('should not emit the change event', () => {
        expect(registeredOnChange).not.toHaveBeenCalled();
      });

      it('should not emit the touched event', () => {
        expect(registeredOnTouche).not.toHaveBeenCalled();
      });
    });

    describe('with for/root property', () => {
      const value = 'TaskId';

      beforeEach(() => {
        component.writeValue(value);
      });
      
      it('should emit the for returned by the "retrieveField" method', () => {
        expect(spy).toHaveBeenCalledWith('root');
      });

      it('should emit the change event with the field', () => {
        expect(registeredOnChange).toHaveBeenCalledWith(TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID);
      });

      it('should emit the touched event with the field value', () => {
        expect(registeredOnTouche).toHaveBeenCalledWith(TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID);
      });
    });

    describe('With custom property', () => {
      const value = 'someProperty';

      beforeEach(() => {
        component.writeValue(value);
      });
      
      it('should emit the for returned by the "retrieveField" method', () => {
        expect(spy).toHaveBeenCalledWith('custom');
      });

      it('should emit the change event with the field', () => {
        expect(registeredOnChange).toHaveBeenCalledWith(value);
      });

      it('should emit the touched event with the field value', () => {
        expect(registeredOnTouche).toHaveBeenCalledWith(value);
      });
    });

    describe('With null', () => {
      beforeEach(() => {
        component.writeValue(null);
      });

      it('should set the value as null', () => {
        expect(component.value).toBeNull();
      });
    });
  });

  it('should retrieve the label', () => {
    component['retrieveLabel']({ for: 'root', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID, type: 'string' });
    expect(mockDataFiltersService.retrieveLabel).toHaveBeenCalled();
  });
});