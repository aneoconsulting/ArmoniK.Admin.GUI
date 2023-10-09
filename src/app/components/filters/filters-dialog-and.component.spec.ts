import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { IconsService } from '@services/icons.service';
import { FiltersDialogAndComponent } from './filters-dialog-and.component';

describe('FiltersDialogAndComponent', () => {
  let component: FiltersDialogAndComponent<number, number>;
  let fixture: ComponentFixture<FiltersDialogAndComponent<number, number>>;
  let removeChangeSpy: jest.SpyInstance; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        FiltersDialogAndComponent,
        IconsService,
        { provide: DATA_FILTERS_SERVICE, useValue: {
          retrieveFiltersDefinitions: jest.fn(() => {
            return [];
          })
        }}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersDialogAndComponent<number, number>);
    component = fixture.componentInstance;
    component.filter = {
      field: 1,
      for: 'root',
      operator: 0,
      value: 1
    };
    fixture.detectChanges();
    removeChangeSpy = jest.spyOn(component.removeChange, 'emit');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct icon', () => {
    expect(component.getIcon('more')).toEqual('more_vert');
    expect(component.getIcon('clear')).toEqual('clear');
    expect(component.getIcon('delete')).toEqual('delete');
  });

  it('should clear the value of the filter', () => {
    component.onClear();
    expect(component.filter.value).toBeNull();
  });

  it('should emit on remove', () => {
    component.onRemove();
    expect(removeChangeSpy).toHaveBeenCalledWith(component.filter);
  });
});