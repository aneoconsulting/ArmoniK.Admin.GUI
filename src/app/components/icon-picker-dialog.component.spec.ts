import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { IconPickerDialogComponent } from './icon-picker-dialog.component';

describe('IconPickerDialogComponent', () => {
  let component: IconPickerDialogComponent;

  const icons: string[] = ['session', 'application', 'tasks', 'remove', 'add', 'arrow'];
  const mockIconsService = {
    getIcon: jest.fn((value: string) => icons.find((icon) => icon === value)),
    getAllIcons: jest.fn(() => icons)
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IconPickerDialogComponent,
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(IconPickerDialogComponent);
    component.icon = 'icon';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('filerIcons', () => {
    it('should filter icons', () => {
      component.iconFormControl.setValue('ion');
      component.filterIcons();
      expect(component.filteredIcons()).toEqual(['session', 'application']);
    });

    it('should display all icons by default', () => {
      expect(component.filteredIcons()).toEqual(icons);
    });
  });

  it('should get an icon', () => {
    expect(component.getIcon('session')).toEqual('session');
  });

  test('selectFirst should select first icon of the list', () => {
    const spy = jest.spyOn(component.iconChange, 'next');
    component.selectFirst();
    expect(spy).toHaveBeenCalledWith(icons[0]);
  });

  describe('selectIcon', () => {
    it('should emit an icon', () => {
      const spy = jest.spyOn(component.iconChange, 'next');
      component.selectIcon('newIcon');
      expect(spy).toHaveBeenCalledWith('newIcon');
    });
  });
});