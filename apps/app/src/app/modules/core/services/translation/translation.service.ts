import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export enum LanguageCode {
  EN = 'en',
  FR = 'fr',
}

type Language = {
  code: LanguageCode;
  name: string;
};

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(private translateService: TranslateService) {}

  private languages: Language[] = [
    { code: LanguageCode.EN, name: 'en' },
    { code: LanguageCode.FR, name: 'fr' },
  ];

  private storageKey = 'lang';

  private currentLanguage = LanguageCode.EN;

  initLanguage() {
    this.currentLanguage =
      this.getLanguageFromStorage() ||
      (this.translateService.getBrowserLang() as LanguageCode | undefined) ||
      LanguageCode.EN;
    this.translateService.use(this.currentLanguage);
  }

  setLanguage(lang: LanguageCode) {
    this.currentLanguage = lang;
    this.translateService.use(this.currentLanguage);
    this.setLanguageToStorage(this.currentLanguage);
  }

  getLanguages() {
    return this.languages;
  }

  getCurrantLanguage() {
    return this.currentLanguage;
  }

  private setLanguageToStorage(lang: LanguageCode) {
    localStorage.setItem(this.storageKey, lang);
  }

  private getLanguageFromStorage() {
    return localStorage.getItem(this.storageKey) as LanguageCode | undefined;
  }
}
