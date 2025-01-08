import { TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Filter } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersDialogOrComponent } from './filters-dialog-or.component';

describe('FiltersDialogOrComponent', () => {
  let component: FiltersDialogOrComponent<TaskSummaryEnumField, TaskOptionEnumField>;
  const filter1: Filter<TaskSummaryEnumField, TaskOptionEnumField> = {
    field: 1,
    for: 'root',
    operator: 1,
    value: 'someValue'
  };
  const filter2: Filter<TaskSummaryEnumField, TaskOptionEnumField> = {
    field: 1,
    for: 'root',
    operator: 2,
    value: 'other'
  };

  beforeEach(async () => {
    component = TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        FiltersDialogOrComponent,
        IconsService,
      ]
    }).inject(FiltersDialogOrComponent<TaskSummaryEnumField, TaskOptionEnumField>);
    component.filtersOr = [filter1, filter2];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('add')).toEqual('add_circle');
    expect(component.getIcon('more')).toEqual('more_vert');
    expect(component.getIcon('delete')).toEqual('delete');
  });

  it('should push on add', () => {
    component.onAdd();
    expect(component.filtersOr[2]).toEqual({
      for: null,
      field: null,
      operator: null,
      value: null
    });
  });

  describe('RemoveAnd', () => {
    it('should remove on removeAnd', () => {
      component.onRemoveAnd(filter1);
      expect(component.filtersOr).toEqual([filter2]);
    });
  
    it('should push a new empty filter if the group is empty', () => {
      component.onRemoveAnd(component.filtersOr[0]);
      component.onRemoveAnd(component.filtersOr[0]);
      expect(component.filtersOr).toEqual([
        {
          for: null,
          field: null,
          operator: null,
          value: null,
        }
      ]);
    });
  });

  it('should emit on removeOr', () => {
    const spy = jest.spyOn(component.removeChange, 'emit');
    component.onRemoveOr();
    expect(spy).toHaveBeenCalledWith(component.filtersOr);
  });
});