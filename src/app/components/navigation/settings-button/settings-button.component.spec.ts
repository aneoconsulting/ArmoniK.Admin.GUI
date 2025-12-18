import { TestBed } from '@angular/core/testing';
import { IconsService } from '@services/icons.service';
import { SettingsButtonComponent } from './settings-button.component';

describe('SettingsButtonComponent', () => {
  let component: SettingsButtonComponent;

  const mockReturnIcon = 'settings-icon';
  const mockIconsService = {
    getIcon: jest.fn(() => mockReturnIcon),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SettingsButtonComponent,
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(SettingsButtonComponent);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialisation', () => {
    it('should call the icon service', () => {
      expect(mockIconsService.getIcon).toHaveBeenCalledWith('settings');
    });

    it('should set the icon', () => {
      expect(component.icon).toBe(mockReturnIcon);
    });
  });

  describe('isHovered', () => {
    it('should be set to true', () => {
      component.mouseEnterListener();
      expect(component.isHovered()).toBeTruthy();
    });

    it('should be set to false on mouse leave', () => {
      component.mouseLeaveListener();
      expect(component.isHovered()).toBeFalsy();
    });
  });
});