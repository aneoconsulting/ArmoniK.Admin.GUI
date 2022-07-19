import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageCode } from '../enums';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let router: Router;
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
    });
    router = TestBed.inject(Router);
    service = TestBed.inject(LanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default language set to English', () => {
    expect(service.fallbackLang).toEqual(LanguageCode.en);
  });

  it('should change language', () => {
    const language = LanguageCode.en;
    service.currentLang = language;

    expect(service.currentLang).toEqual(language);
    expect(localStorage.getItem('lang')).toEqual(language);
  });

  it('should init language', () => {
    service.init();

    expect(service.currentLang).toEqual(LanguageCode.en);
  });

  it('should init using local storage', () => {
    const storageLanguage = LanguageCode.fr;
    localStorage.setItem('lang', storageLanguage);

    service.init();

    expect(service.currentLang).toEqual(storageLanguage);
    localStorage.removeItem('lang');
  });

  it('should init using navigator language', () => {
    service.fallbackLang = LanguageCode.fr;

    service.init();

    expect(service.currentLang).toEqual(LanguageCode.en);
  });

  it('should have an function to translate instantly', () => {
    expect(service.instant).toBeTruthy();
  });

  it('should have an function to translate asynchronously', () => {
    expect(service.translate).toBeTruthy();
  });

  it('should reload interface when language changes', fakeAsync(() => {
    spyOn(router, 'navigateByUrl');

    service.init();

    service.currentLang = LanguageCode.fr;
    tick();
    expect(service.currentLang).toEqual(LanguageCode.fr);
    expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
  }));
});
