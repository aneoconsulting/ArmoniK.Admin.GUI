import { LOCALE_ID, Provider } from '@angular/core';
import { TranslationService } from '../services/translation.service';

export class LocaleId extends String {
  constructor(private translationService: TranslationService) {
    super();
  }

  override toString(): string {
    return this.translationService.currentLocale;
  }

  override valueOf(): string {
    return this.toString();
  }
}

export const LocaleProvider: Provider = {
  provide: LOCALE_ID,
  useClass: LocaleId,
  deps: [TranslationService],
};
