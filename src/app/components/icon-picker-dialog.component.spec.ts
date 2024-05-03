import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { IconPickerDialogComponent } from './icon-picker-dialog.component';

describe('IconPickerDialogComponent', () => {
  let component: IconPickerDialogComponent;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IconPickerDialogComponent,
        IconsService,
      ]
    }).inject(IconPickerDialogComponent);

    component.icon = 'icon';
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter icons', () => {
    component.filterIcons('icon');
    expect(component.filteredIcons).toEqual(['icon']);
  });

  it('should get an icon', () => {
    expect(component.getIcon('icon')).toEqual('palette');
  });

  it('should select first', () => {
    component.filteredIcons = ['icon', 'newIcon'];
    const spy = jest.spyOn(component.iconChange, 'next');
    component.selectFirst();
    expect(spy).toHaveBeenCalledWith(component.filteredIcons[0]);
  });

  describe('selectIcon', () => {
    it('should emit a new icon', () => {
      const spy = jest.spyOn(component.iconChange, 'next');
      component.selectIcon('newIcon');
      expect(spy).toHaveBeenCalledWith('newIcon');
    });
  });

  it('should filter icon on input change', () => {
    component.iconFormControl.setValue('icon');
    expect(component.filteredIcons).toEqual(['icon']);
  });
});