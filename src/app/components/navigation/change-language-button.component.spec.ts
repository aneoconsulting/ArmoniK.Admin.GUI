import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';
import { ChangeLanguageButtonComponent } from './change-language-button.component';

describe('ChangeLanguageButtonComponent', () => {
  let component: ChangeLanguageButtonComponent;

  const mockRouter = {
    url: '/my-route',
  };

  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn(),
  };

  const mockWindow = {
    location: {
      pathname: 'admin',
    }
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ChangeLanguageButtonComponent,
        {provide: Router, useValue: mockRouter},
        DefaultConfigService,
        IconsService,
        {provide: StorageService, useValue: mockStorageService},
        { provide: Window, useValue: mockWindow },
      ]
    }).inject(ChangeLanguageButtonComponent);
    component.ngOnInit();
    mockWindow.location.pathname = 'admin';
  });

  it('should run', () => {
    expect(component).toBeDefined();
  });

  describe('on init', () => {
    it('should get Language from default config', () => {
      mockStorageService.getItem.mockImplementationOnce(() => null);
      mockWindow.location.pathname = 'admin/undefined';
      component.ngOnInit();
      expect(component.selectedLanguage).toEqual('en');
    });
  
    it('should update available languages', () => {
      component.ngOnInit();
      expect(component.availableLanguages).toEqual(new DefaultConfigService().availableLanguages.filter(language => language !== 'en'));
    });
  });

  it('should set language', () => {
    const language = 'fr';
    component.setLanguage(language);
    expect(mockStorageService.setItem).toHaveBeenCalledWith('language', language);
  });

  it('should get icons', () => {
    expect(component.getIcon('language')).toEqual('language');
  });

  it('should get route', () => {
    expect(component.getRoute()).toEqual('/my-route');
  });

  describe('getLanguageFromUrl', () => {
    it('should not get language from url if it is not found', () => {
      mockWindow.location.pathname = 'admin';
      expect(component.getLanguageFromUrl()).toBeUndefined();
    });

    it('should get language from url', () => {
      mockWindow.location.pathname = 'en/admin';
      expect(component.getLanguageFromUrl()).toEqual('en');
    });

    it('should not get a language from url that is not saved', () => {
      mockWindow.location.pathname = 'fr/admin';
      expect(component.getLanguageFromUrl()).toBeUndefined();
    });
  });
});