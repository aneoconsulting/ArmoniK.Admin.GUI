import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FiltersAnd, FiltersOr } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersDialogComponent } from './filters-dialog.component';

describe('FiltersDialogComponent', () => {
  let component: FiltersDialogComponent<number, number>;

  const filterAnd1: FiltersAnd<number, number> = [{
    field: 1,
    for: 'root',
    operator: 1,
    value: 'someValue'
  }];
  const filterAnd2: FiltersAnd<number, number> = [{
    field: 1,
    for: 'root',
    operator: 2,
    value: 'otherValue'
  }];

  const filterOr: FiltersOr<number, number> = [
    filterAnd1, filterAnd2
  ];
  const mockMatDialogData = {
    filtersOr: [] as FiltersOr<number, number>
  };
  const mockDialogRef = {
    close: jest.fn()
  };

  beforeEach(async () => {
    component = TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        FiltersDialogComponent,
        IconsService,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
      ]
    }).inject(FiltersDialogComponent);
    mockMatDialogData.filtersOr = filterOr;
    component.ngOnInit();
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should init with empty filters', () => {
    component.filtersOr = [];
    mockMatDialogData.filtersOr = [];
    
    component.ngOnInit();
    expect(component.filtersOr).toEqual([[{
      for: null,
      field: null,
      operator: null,
      value: null,
    }]]);
  });

  it('should add empty FilterAnd on add', () => {
    component.onAdd();
    expect(component.filtersOr[2]).toEqual([
      {
        for: null,
        field: null,
        operator: null,
        value: null,
      }
    ]);
  });

  describe('removeOr', () => {
    it('should remove a filter from orFilter', () => {
      const toRemove = component.filtersOr[0];
      component.onRemoveOr(toRemove);
      expect(component.filtersOr).toEqual([filterAnd2]);
    });

    it('should push a new empty filter if the group is empty', () => {
      component.onRemoveOr(component.filtersOr[0]);
      component.onRemoveOr(component.filtersOr[0]);
      expect(component.filtersOr).toEqual([
        [{
          for: null,
          field: null,
          operator: null,
          value: null,
        }]
      ]);
    });
  });

  it('should close on no click', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should get icon', () => {
    expect(component.getIcon('add')).toEqual('add');
  });
});