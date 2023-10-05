import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { FiltersAnd, FiltersOr } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersDialogComponent } from './filters-dialog.component';

describe('FiltersDialogComponent', () => {
  let component: FiltersDialogComponent<number, number>;
  let fixture: ComponentFixture<FiltersDialogComponent<number, number>>;
  const filterAnd: FiltersAnd<number, number> = [{
    field: 1,
    for: 'root',
    operator: 1,
    value: 'someValue'
  }];
  const filterOr: FiltersOr<number, number> = [
    filterAnd
  ];
  const mockMatDialogData = {
    filtersOr: [] as FiltersOr<number, number>
  };
  const mockDialogRef = {
    close: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        FiltersDialogComponent,
        IconsService,
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockMatDialogData },
        { provide: DATA_FILTERS_SERVICE, useValue: {
          retrieveFiltersDefinitions: jest.fn(() => {
            return [];
          }),
          retrieveLabel: jest.fn()
        } },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    mockMatDialogData.filtersOr = filterOr;
    fixture = TestBed.createComponent(FiltersDialogComponent<number, number>);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    expect(component.filtersOr[1]).toEqual([
      {
        for: null,
        field: null,
        operator: null,
        value: null,
      }
    ]);
  });

  it('should remove from orFilter', () => {
    const toRemove = component.filtersOr[0];
    component.onRemoveOr(toRemove);
    expect(component.filtersOr).toEqual([]);
  });

  it('should close on no click', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should get icon', () => {
    expect(component.getIcon('add')).toEqual('add');
  });

  it('should track by filter', () => {
    expect(component.trackByFilter(0, filterAnd)).toEqual('01');
  });
});