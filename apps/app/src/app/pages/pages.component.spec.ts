import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { PagesComponent } from './pages.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClarityModule } from '@clr/angular';
import { UiModule } from '@armonik.admin.gui/ui';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Language,
  LanguageCode,
  LanguageService,
  SettingsService,
} from '../core';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { Router } from '@angular/router';

describe('PagesComponent', () => {
  let component: PagesComponent;
  let fixture: ComponentFixture<PagesComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [PagesComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        UiModule,
        ClarityModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should update date every second', fakeAsync(() => {
      const initialNow = component.now;
      component.ngOnInit();
      tick(2000 * 60);
      discardPeriodicTasks();
      expect(component.now).toBeGreaterThan(initialNow);
    }));
  });

  describe('track by', () => {
    it('should return label for navigation link', () => {
      const label = 'Dashboard';
      const link = { path: ['/', 'dashboard'], label };
      expect(component.trackByLabel(0, link)).toBe(label);
    });

    it('should return name for language', () => {
      const lang = { code: LanguageCode.en, name: 'English' } as Language;
      expect(component.trackByLanguageName(0, lang)).toBe(lang.name);
    });

    it('should return application name and version for application', () => {
      const applicationId = {
        applicationName: 'Test',
        applicationVersion: '1.0.0',
      } as Application['_id'];
      expect(component.trackByApplicationId(0, applicationId)).toBe(
        `${applicationId.applicationName}${applicationId.applicationVersion}`
      );
    });
  });

  describe('language', () => {
    it('should change language', () => {
      const lang = { code: LanguageCode.en, name: 'English' } as Language;

      const languageService = TestBed.inject(LanguageService);
      component.changeLanguage(lang.code);

      expect(languageService.currentLang).toBe(lang.code);
    });
  });

  describe('application', () => {
    it('should remove application', () => {
      const application = {
        applicationName: 'Test',
        applicationVersion: '1.0.0',
      } as Application['_id'];

      const settingsService = TestBed.inject(SettingsService);
      spyOn(settingsService, 'removeCurrentApplication');

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');

      component.removeApplication(application);

      expect(settingsService.removeCurrentApplication).toHaveBeenCalledWith(
        application
      );
      expect(router.navigate).toHaveBeenCalledWith(['/', 'dashboard']);
    });
  });

  describe('ui', () => {
    it('should have a "clr-main-container"', () => {
      expect(
        fixture.nativeElement.querySelector('clr-main-container')
      ).toBeTruthy();
    });

    it('should contains a "content-container" class', () => {
      expect(
        fixture.nativeElement.querySelector('.content-container')
      ).toBeTruthy();
    });

    it('should contains a "content-area" class', () => {
      expect(fixture.nativeElement.querySelector('.content-area')).toBeTruthy();
    });

    it('should have a router-outlet', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('router-outlet')).toBeTruthy();
    });

    it('should have a header', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('ui-header')).toBeTruthy();
    });

    it('should contain a title with "Armonik"', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('ui-header .title').textContent).toContain(
        'ArmoniK'
      );
    });

    it('should contains a list of language', () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('ui-header .language')).toBeTruthy();
    });
  });
});
