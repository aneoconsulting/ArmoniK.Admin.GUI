import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Theme } from '@app/types/themes';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';
import { ThemeSelectorComponent } from './theme-selector.component';

describe('ThemeSelectorComponent', () => {
  let component: ThemeSelectorComponent;
  let fixture: ComponentFixture<ThemeSelectorComponent>;

  const mockStorageService = {
    getItem: jest.fn(() => {
      return 'pink-bluegrey';
    }),
    setItem: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ThemeSelectorComponent,
        DefaultConfigService,
        { provide: StorageService, useValue: mockStorageService },
        IconsService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeSelectorComponent);
    component = fixture.componentInstance;
    component.currentTheme = 'deeppurple-amber';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get icon', () => {
    expect(component.getIcon('format-color-fill')).toEqual('format_color_fill');
  });

  it('should update theme', () => {
    component.updateTheme('indigo-pink');
    expect(component.currentTheme).toEqual('indigo-pink');
    component.updateTheme('deeppurple-amber');
    expect(component.currentTheme).toEqual('deeppurple-amber');
  });

  // no tests for addTheme since it is already tested via other methods tests
  describe('removeTheme private method', () => {

    it('should remove the currentTheme if it exists', () => {
      component.updateTheme('indigo-pink');
    });

    it('should not remove theme if it is not availabe', () => {
      const wrongTheme = 'some-theme' as Theme;
      component.currentTheme = wrongTheme;
      const spy = jest.spyOn(document, 'getElementById');
      component.updateTheme(wrongTheme);
      expect(spy).toHaveBeenCalledTimes(0);
    });

    it('should not remove theme if there is no theme element', () => {
      const spyId = jest.spyOn(document, 'getElementById');
      spyId.mockImplementationOnce(() => {
        return null;
      });
      const spyTagName = jest.spyOn(document, 'getElementsByTagName');
      component.currentTheme = 'indigo-pink';
      component.updateTheme('indigo-pink');
      expect(spyTagName).toHaveBeenCalledTimes(0);
    });
  });
});