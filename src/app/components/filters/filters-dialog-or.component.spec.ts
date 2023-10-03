import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { Filter } from '@app/types/filters';
import { IconsService } from '@services/icons.service';
import { FiltersDialogOrComponent } from './filters-dialog-or.component';

describe('FiltersDialogOrComponent', () => {
  let component: FiltersDialogOrComponent<number, number>;
  let fixture: ComponentFixture<FiltersDialogOrComponent<number, number>>;
  const defaultFilter: Filter<number, number> = {
    field: 1,
    for: 'root',
    operator: 1,
    value: 'someValue'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        FiltersDialogOrComponent,
        IconsService,
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
    fixture = TestBed.createComponent(FiltersDialogOrComponent<number, number>);
    component = fixture.componentInstance;
    component.filtersOr = [defaultFilter];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shoul get icon', () => {
    expect(component.getIcon('add')).toEqual('add');
    expect(component.getIcon('more')).toEqual('more_vert');
    expect(component.getIcon('delete')).toEqual('delete');
  });

  it('should push on add', () => {
    component.onAdd();
    expect(component.filtersOr[1]).toEqual({
      for: null,
      field: null,
      operator: null,
      value: null
    });
  });

  it('should remove on removeAnd', () => {
    component.onRemoveAnd(defaultFilter);
    expect(component.filtersOr).toEqual([]);
  });

  it('should emit on removeOr', () => {
    const spy = jest.spyOn(component.removeChange, 'emit');
    component.onRemoveOr();
    expect(spy).toHaveBeenCalledWith(component.filtersOr);
  });
});