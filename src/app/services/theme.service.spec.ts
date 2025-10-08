import { RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ALL_THEMES, Theme } from '@app/types/themes';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  const mockRenderer = {
    removeClass: jest.fn(),
    addClass: jest.fn(),
  };

  const mockRendererFactory = {
    createRenderer: jest.fn(() => mockRenderer),
  };

  const storedItem: Theme = 'dark-green';
  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn((): Theme | null => storedItem),
  };

  const mockDefaultConfigService = {
    defaultTheme: 'light-blue',
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ThemeService,
        { provide: RendererFactory2, useValue: mockRendererFactory },
        { provide: StorageService, useValue: mockStorageService },
        { provide: DefaultConfigService, useValue: mockDefaultConfigService },
      ]
    }).inject(ThemeService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should apply the stored theme', () => {
      expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, storedItem);
    });

    it('should remove all themes that are not the selected one', () => {
      expect(mockRenderer.removeClass).toHaveBeenCalledTimes(ALL_THEMES.length - 1);
    });

    it('should apply the default theme if none is stored', () => {
      mockStorageService.getItem.mockReturnValueOnce(null);
      service['initTheme']();
      expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, mockDefaultConfigService.defaultTheme);
    });
  });

  describe('changeTheme', () => {
    describe('valid theme', () => {
      const newTheme: Theme = 'light-pink';

      beforeEach(() => {
        service.changeTheme(newTheme);
      });

      it('should store the new theme', () => {
        expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-theme', newTheme);
      });
      
      it('should update the currentTheme property', () => {
        expect(service['currentTheme']).toBe(newTheme);
      });

      it('should apply the theme if it is valid', () => {
        expect(mockRenderer.addClass).toHaveBeenCalledWith(document.body, newTheme);
      });
    });

    describe('invalid theme', () => {
      beforeEach(() => {
        service['currentTheme'] = storedItem;
        mockRenderer.addClass.mockClear();
      });

      it('should not apply an unexisting theme', () => {
        service.changeTheme('some-theme');
        expect(mockRenderer.addClass).not.toHaveBeenCalled();
      });

      it('should not apply an already existing theme', () => {
        service.changeTheme(storedItem);
        expect(mockRenderer.addClass).not.toHaveBeenCalled();
      });

      it('should not apply the theme if it is undefined or null', () => {
        service.changeTheme(null as unknown as Theme);
        expect(mockRenderer.addClass).not.toHaveBeenCalled();
      });
    });
  });
});