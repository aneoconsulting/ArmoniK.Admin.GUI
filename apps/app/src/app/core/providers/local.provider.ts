import { LOCALE_ID, Provider } from '@angular/core';
import { LanguageService } from '../services';

export class LocalId extends String {
  constructor(private languageService: LanguageService) {
    super();
  }

  override toString(): string {
    return this.languageService.currentLang;
  }

  override valueOf(): string {
    return this.toString();
  }
}

export const LocaleProvider: Provider = {
  provide: LOCALE_ID,
  useClass: LocalId,
  deps: [LanguageService],
};
