import { FilterStringOperator, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FilterDefinition, FilterFor } from '@app/types/filter-definition';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { FiltersDialogAndComponent } from './filters-dialog-and.component';
import { FilterInputValue, FormFilterType } from './types';

describe('FiltersDialogAndComponent', () => {
  let component: FiltersDialogAndComponent<TaskSummaryEnumField, TaskOptionEnumField>;

  const filterForm = new FormGroup<FormFilterType<TaskSummaryEnumField, TaskOptionEnumField>>({
    field: new FormControl<TaskSummaryEnumField | TaskOptionEnumField | null>(TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID),
    for: new FormControl<FilterFor<TaskSummaryEnumField, TaskOptionEnumField> | null>('root'),
    operator: new FormControl<number | null>(FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH),
    value: new FormControl<FilterInputValue>('id'),
  });

  const statuses = [{key: 1, value: 'done'}, {key: 2, value: 'error'}, {key: 3, value: 'running'}];
  const mockTaskFiltersService = {
    filtersDefinitions: [
      {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
        for: 'root',
        type: 'string'
      },
      {
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
        for: 'root',
        type: 'status',
        statuses: statuses
      }
    ] as FilterDefinition<TaskSummaryEnumField, TaskOptionEnumField>[],
  };

  const mockedFoundOperators: Record<number, string> = {
    [FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH]: 'Ends with'
  };
  const mockFilterService = {
    findOperators: jest.fn(() => mockedFoundOperators)
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        FiltersDialogAndComponent,
        IconsService,
        { provide: DataFilterService, useValue: mockTaskFiltersService },
        { provide: FiltersService, useValue: mockFilterService },
      ],
    }).inject(FiltersDialogAndComponent<TaskSummaryEnumField, TaskOptionEnumField>);
    component.form = new FormArray([
      filterForm
    ]);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  it('should add an empty filter to the formArray', () => {
    component.add();
    expect(component.filterAnd.length).toEqual(2);
  });

  describe('updating the field of a filter', () => {
    beforeEach(() => {
      filterForm.controls.field.setValue(TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS);
    });

    it('should set the filter operator to null', () => {
      expect(filterForm.value.operator).toBeNull();
    });
    
    it('should set the filter value to null', () => {
      expect(filterForm.value.value).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove the nth element from the formarray', () => {
      component.add();
      component.remove(0);
      expect(component.filterAnd.length).toEqual(1);
    });

    it('should add an element back if the formArray is empty', () => {
      const spy = jest.spyOn(component, 'add');
      component.remove(0);
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should retrieve the record of operators and their labels', () => {
    expect(component.findOperators('string')).toEqual(mockedFoundOperators);
  });

  describe('findType', () => {
    it('should retrieve the the type of the filter', () => {
      expect(component.findType(filterForm.value)).toEqual('status');
    });

    it('should return default type "string" if no metadata exists', () => {
      expect(component.findType({
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ACQUIRED_AT,
        for: 'root',
      })).toEqual('string');
    });

    it('should return default type "string" if there is no defined field', () => {
      expect(component.findType({
        for: 'root',
      })).toEqual('string');
    });

    it('should return default type "string" if the filter is on a custom', () => {
      expect(component.findType({
        field: 'customField',
        for: 'custom',
      })).toEqual('string');
    });
  });

  describe('findStatuses', () => {
    it('should retrieve all statuses linked to a field', () => {
      expect(component.findStatuses({
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
        for: 'root',
      })).toEqual(statuses.map((status) => status.value));
    });

    it('should return an empty array if the field is not of type "status"', () => {
      expect(component.findStatuses({
        field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ACQUIRED_AT,
        for: 'root',
      })).toEqual([]);
    });

    it('should return an empty array if there is no defined field', () => {
      expect(component.findStatuses({})).toEqual([]);
    });
  });

  test('updateFor should update the field "for" of the provided filter', () => {
    const newFor = 'custom';
    component.updateFor(filterForm, newFor);
    expect(filterForm.value.for).toEqual(newFor);
  });
});