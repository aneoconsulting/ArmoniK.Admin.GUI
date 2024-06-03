import { FilterDateOperator, FilterStringOperator, SessionRawEnumField, SessionTaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FiltersOr } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersToolbarComponent } from './filters-toolbar.component';

describe('FiltersToolbarComponent', () => {
  let component: FiltersToolbarComponent<SessionRawEnumField, SessionTaskOptionEnumField>;

  const initialShowFilters = false;
  const filters: FiltersOr<SessionRawEnumField, SessionTaskOptionEnumField> = [[
    {
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
      for: 'root',
      operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
      value: 'sessionId'
    }
  ]];

  const dialogReturnFilter: FiltersOr<SessionRawEnumField, SessionTaskOptionEnumField> = [[
    {
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
      for: 'root',
      operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
      value: new Date()
    },
    {
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
      for: 'root',
      operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
      value: 'sessionId'
    }
  ]];
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return of(dialogReturnFilter);
        }
      };
    })
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        FiltersToolbarComponent,
        IconsService,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: ViewContainerRef, useValue: {} }
      ]
    }).inject(FiltersToolbarComponent<SessionRawEnumField, SessionTaskOptionEnumField>);
    component.filters = filters;
    component.showFilters = initialShowFilters;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should set filters', () => {
    expect(component.filters).toEqual(filters);
  });

  it('should set hasFilters', () => {
    expect(component.hasFilters).toBeTruthy();
  });

  it('should set hasOneOrFilter', () => {
    expect(component.hasOneOrFilter).toBeTruthy();
  });

  it('should set showFilters', () => {
    expect(component.showFilters).toEqual(initialShowFilters);
  });

  it('should get icon', () => {
    expect(component.getIcon('add')).toEqual('add');
  });

  describe('toggleShow', () => {
    let spy: jest.SpyInstance;
    beforeEach(() => {
      spy = jest.spyOn(component.showFiltersChange, 'emit');
      component.toggleShow();
    });

    it('should toggle showFilters', () => {
      expect(component.showFilters).toEqual(!initialShowFilters);
    });

    it('should call showFiltersChange.emit', () => {
      expect(spy).toHaveBeenCalledWith(component.showFilters);
    });
  });

  describe('openFiltersDialog', () => {
    it('should set filters', () => {
      component.openFiltersDialog();
      expect(component.filters).toEqual(dialogReturnFilter);
    });

    it('should emit filters', () => {
      const spy = jest.spyOn(component.filtersChange, 'emit');
      component.openFiltersDialog();
      expect(spy).toHaveBeenCalledWith(dialogReturnFilter);
    });

    it('should set hasFilters', () => {
      component.openFiltersDialog();
      expect(component.hasFilters).toBeTruthy();
    });

    it('should set hasOneOrFilter', () => {
      component.openFiltersDialog();
      expect(component.hasOneOrFilter).toBeTruthy();
    });

    it('should set an empty filter if there is only nulls values', () => {
      const nullFilters: FiltersOr<SessionRawEnumField, SessionTaskOptionEnumField> = [[{
        field: null,
        for: null,
        operator: null,
        value: null
      }]];
      mockMatDialog.open.mockReturnValueOnce({afterClosed: () => of(nullFilters)});
      component.openFiltersDialog();
      expect(component.filters).toEqual([]);
    });
  });

  it('should know if a filter is null', () => {
    const nullFilter: FiltersOr<SessionRawEnumField, SessionTaskOptionEnumField> = [[{
      field: null,
      for: null,
      operator: null,
      value: null
    }]];
    expect(component.isFilterNull(nullFilter)).toBeTruthy();
  });
});