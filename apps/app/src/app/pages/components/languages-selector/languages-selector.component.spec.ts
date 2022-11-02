import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Language, LanguageCode, LanguageService } from '../../../core';
import { LanguagesSelectorComponent } from './languages-selector.component';

const WindowMock = {
  location: { reload: jasmine.createSpy('reload') },
} as unknown as Window & typeof globalThis;

describe('LanguagesSelectorComponent', () => {
  let component: LanguagesSelectorComponent;
  let fixture: ComponentFixture<LanguagesSelectorComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [LanguagesSelectorComponent],
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
      providers: [{ provide: Window, useValue: WindowMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return name for language', () => {
    const lang = { code: LanguageCode.en, name: 'English' } as Language;
    expect(component.trackByLanguageName(0, lang)).toBe(lang.name);
  });

  describe('changeLanguage', () => {
    it('should update language in storage', () => {
      const lang = { code: LanguageCode.en, name: 'English' } as Language;

      const languageService = TestBed.inject(LanguageService);
      spyOn(languageService, 'setLanguageInStorage');

      component.changeTo(lang.code);

      expect(languageService.setLanguageInStorage).toHaveBeenCalledWith(
        lang.code
      );
    });

    it('should reload page', () => {
      const lang = { code: LanguageCode.en, name: 'English' } as Language;

      const window = TestBed.inject(Window);

      component.changeTo(lang.code);

      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  describe('isSelected', () => {
    it('should return true if language is selected', () => {
      const lang = { code: LanguageCode.en, name: 'English' } as Language;

      const languageService = TestBed.inject(LanguageService);
      languageService.currentLang = lang.code;

      expect(component.isSelected(lang.code)).toBeTruthy();
    });

    it('should return false if language is not selected', () => {
      const lang = { code: LanguageCode.en, name: 'English' } as Language;

      const languageService = TestBed.inject(LanguageService);
      languageService.currentLang = LanguageCode.fr;

      expect(component.isSelected(lang.code)).toBeFalsy();
    });
  });
});
