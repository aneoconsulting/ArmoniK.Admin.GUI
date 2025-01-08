import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsService } from '@services/icons.service';
import { FiltersDialogAndComponent } from './filters-dialog-and.component';

describe('FiltersDialogAndComponent', () => {
  let component: FiltersDialogAndComponent<number, number>;
  let removeChangeSpy: jest.SpyInstance; 

  beforeEach(async () => {
    component = TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      providers: [
        FiltersDialogAndComponent,
        IconsService,
      ]
    }).inject(FiltersDialogAndComponent<number, number>);
    component.filter = {
      field: 1,
      for: 'root',
      operator: 0,
      value: 1
    };
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