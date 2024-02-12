import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { ChangeLanguageButtonComponent } from './change-language-button.component';

function overrideLocation(newLocation: string) {
  Object.defineProperty(window, 'location', {
    value: {
      pathname: newLocation
    },
    writable: true
  });
}

describe('ChangeLanguageButtonComponent', () => {
  let component: ChangeLanguageButtonComponent;

  const mockRouter = {
    url: '/my-route',
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ChangeLanguageButtonComponent,
        {provide: Router, useValue: mockRouter},
        DefaultConfigService,
        IconsService
      ]
    }).inject(ChangeLanguageButtonComponent);

  });

  it('should run', () => {
    expect(component).toBeDefined();
  });

  describe('on init', () => {
    it('should get Language from URL on init', () => {
      overrideLocation('admin/fr');
      component.ngOnInit();
      expect(component.selectedLanguage).toEqual('fr');
    });
  
    it('should get Language from default config', () => {
      overrideLocation('admin/undefined');
      component.ngOnInit();
      expect(component.selectedLanguage).toEqual('en');
    });
  
    it('should update available languages', () => {
      component.ngOnInit();
      expect(component.availableLanguages).toEqual(new DefaultConfigService().availableLanguages.filter(language => language !== 'en'));
    });
  });

  it('should get icons', () => {
    expect(component.getIcon('language')).toEqual('language');
  });

  it('should get route', () => {
    expect(component.getRoute()).toEqual('my-route');
  });

  it('should track by language', () => {
    expect(component.trackByLanguage(0, 'en')).toEqual('en');
  });
});