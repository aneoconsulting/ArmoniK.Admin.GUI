import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorScheme } from '@app/types/themes';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';
import { SchemeSwitcherComponent } from './scheme-switcher.component';

describe('SchemeSwitcherComponent', () => {
  let component: SchemeSwitcherComponent;

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  const mockStoredValue = 'dark';
  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn((): ColorScheme | null => mockStoredValue),
  };

  const mockDefaultConfigService = {
    defaultColorScheme: 'light dark',
  };

  const elementRefDocumentStyles: Record<string, string> = {};
  const mockElementRef = {
    nativeElement: {
      ownerDocument: {
        documentElement: {
          style: elementRefDocumentStyles,
        }
      }
    }
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SchemeSwitcherComponent,
        { provide: IconsService, useValue: mockIconsService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: DefaultConfigService, useValue: mockDefaultConfigService },
        { provide: ElementRef, useValue: mockElementRef },
      ]
    }).inject(SchemeSwitcherComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set the stored current scheme if it exists', () => {
      expect(component.currentScheme).toBe(mockStoredValue);
    });

    it('should set the scheme style with this value', () => {
      expect(elementRefDocumentStyles['color-scheme']).toEqual(mockStoredValue);
    });

    it('should set the default current scheme if there is no stored value', () => {
      mockStorageService.getItem.mockReturnValueOnce(null);
      component.ngOnInit();
      expect(component.currentScheme).toBe(mockDefaultConfigService.defaultColorScheme);
    });
  });

  describe('select scheme', () => {
    describe('valid schemes', () => {
      const newScheme: ColorScheme = 'light';

      beforeEach(() => {
        component.selectScheme(newScheme);
      });
      
      it('should set the current scheme to the new one', () => {
        expect(component.currentScheme).toBe(newScheme);
      });

      it('should store the newly selected scheme', () => {
        expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-color-scheme', newScheme);
      });

      it('should set the newly selected scheme', () => {
        expect(elementRefDocumentStyles['color-scheme']).toEqual(newScheme);
      });
    });

    it('should not accept undefined schemes', () => {
      component.selectScheme(undefined as unknown as ColorScheme);
      expect(component.currentScheme).toBe(mockStoredValue);
    });

    it('should not accept nullish values', () => {
      component.selectScheme(null as unknown as ColorScheme);
      expect(component.currentScheme).toBe(mockStoredValue);
    });

    it('should not accept string that are not schemes', () => {
      component.selectScheme('some-scheme');
      expect(component.currentScheme).toBe(mockStoredValue);
    });
  });

  it('should get icons', () => {
    const icon = 'dark-mode';
    component.getIcon(icon);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(icon);
  });
});