import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { StorageService } from '@services/storage.service';
import { ChangeLanguageButtonComponent } from './change-language-button.component';

const jestReplace = jest.fn();

const url = 'localhost:4200';

function overrideLocation(newLocation: string) {
  Object.defineProperty(window, 'location', {
    value: {
      pathname: newLocation,
      replace: jestReplace,
      href: url
    },
    writable: true,
    configurable: true
  });
}

describe('ChangeLanguageButtonComponent', () => {
  let component: ChangeLanguageButtonComponent;

  const mockRouter = {
    url: '/my-route',
  };

  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ChangeLanguageButtonComponent,
        {provide: Router, useValue: mockRouter},
        DefaultConfigService,
        IconsService,
        {provide: StorageService, useValue: mockStorageService}
      ]
    }).inject(ChangeLanguageButtonComponent);

  });

  it('should run', () => {
    expect(component).toBeDefined();
  });

  describe('on init', () => {

    it('should get Language from StorageService', () => {
      mockStorageService.getItem.mockImplementationOnce(() => 'fr');
      component.ngOnInit();
      expect(component.selectedLanguage).toEqual('fr');
    });

    it('should get Language from URL', () => {
      mockStorageService.getItem.mockImplementationOnce(() => null);
      overrideLocation('admin/fr');
      component.ngOnInit();
      expect(component.selectedLanguage).toEqual('fr');
    });

    it('should redirect to stored Language if there is a conflict with URL language', () => {
      mockStorageService.getItem.mockImplementationOnce(() => 'en');
      overrideLocation('admin/fr');
      component.ngOnInit();
      expect(jestReplace).toHaveBeenCalledWith('/admin/en/my-route');
    });
  
    it('should get Language from default config', () => {
      mockStorageService.getItem.mockImplementationOnce(() => null);
      overrideLocation('admin/undefined');
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
});