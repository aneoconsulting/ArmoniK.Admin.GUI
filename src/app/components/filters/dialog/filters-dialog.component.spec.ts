import { FilterStringOperator, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FiltersDialogData } from '@app/types/dialog';
import { IconsService } from '@services/icons.service';
import { FiltersDialogComponent } from './filters-dialog.component';

describe('FiltersDialogComponent', () => {
  let component: FiltersDialogComponent<TaskSummaryEnumField, TaskOptionEnumField>;

  const mockData: FiltersDialogData<TaskSummaryEnumField, TaskOptionEnumField> = {
    filtersOr: [
      [
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
          for: 'root',
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: 'id'
        }
      ]
    ],
    customColumns: ['options.options.customColumns']
  };

  const mockEmptyData: FiltersDialogData<TaskSummaryEnumField, TaskOptionEnumField> = {
    filtersOr: [],
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        FiltersDialogComponent,
        IconsService,
        { provide: MAT_DIALOG_DATA, useValue: mockData }
      ]
    }).inject(FiltersDialogComponent<TaskSummaryEnumField, TaskOptionEnumField>);
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => {
    it('should patch the formArray with the values of the provided filters', () => {
      expect(component.form.value).toEqual(mockData.filtersOr);
    });
    
    it('should copy the custom columns', () => {
      expect(component.customProperties).toEqual(mockData.customColumns);
    });

    it('should add an empty filter if none are provided', () => {
      component.data = mockEmptyData;
      const spy = jest.spyOn(component, 'add');
      component['init']();
      expect(spy).toHaveBeenCalled();
    });

    it('should create an empty array of custom properties if none are provided', () => {
      component.data = mockEmptyData;
      component['init']();
      expect(component.customProperties).toEqual([]);
    });
  });

  it('should get icon', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  describe('add', () => {
    it('should add a filter', () => {
      component.add();
      expect(component.form.length).toEqual(2);
    });

    it('should add a filter at selected index', () => {
      component.add(-1);
      expect(component.form.value[0]).toEqual([{
        for: null,
        field: null,
        operator: null,
        value: null,
      }]);
    });
  });

  describe('remove', () => {
    it('should remove the nth element from the formarray', () => {
      component.add();
      component.remove(0);
      expect(component.form.length).toEqual(1);
    });

    it('should add an element back if the formArray is empty', () => {
      const spy = jest.spyOn(component, 'add');
      component.remove(0);
      expect(spy).toHaveBeenCalled();
    });
  });
});