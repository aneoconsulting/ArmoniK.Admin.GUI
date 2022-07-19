import { LOCALE_ID, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageCode } from '../enums';
import { LanguageService } from '../services';
import { LocaleProvider } from './local.provider';

describe('LocalId', () => {
  let languageService: LanguageService;
  let service: typeof LocaleProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocaleProvider],
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
    });
    languageService = TestBed.inject(LanguageService);
    service = TestBed.inject<Provider>(LOCALE_ID);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the current language', () => {
    languageService.currentLang = LanguageCode.en;
    expect(service.toString()).toEqual(LanguageCode.en);
  });

  it('should return the current language using "valueOf"', () => {
    languageService.currentLang = LanguageCode.en;
    expect(service.valueOf()).toEqual(LanguageCode.en);
  });
});
