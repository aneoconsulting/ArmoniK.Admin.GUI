import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
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

    component.selectedIcon = 'icon';
    component.selected$ = new Subject<string>();
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

  describe('selectIcon', () => {
    it('should select an icon', () => {
      component.selectIcon('newIcon');
      expect(component.selectedIcon).toEqual('newIcon');
    });

    it('should emit a new icon', () => {
      const spy = jest.spyOn(component.selected$, 'next');
      component.selectIcon('newIcon');
      expect(spy).toHaveBeenCalledWith('newIcon');
    });
  });

  it('should filter icon on input change', () => {
    component.iconFormControl.setValue('icon');
    expect(component.filteredIcons).toEqual(['icon']);
  });
});