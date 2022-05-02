import { Component, LOCALE_ID, Inject } from '@angular/core';
import { LocaleId } from '../core/providers/locale.provider';
import {
  LanguageCode,
  TranslationService,
} from '../core/services/translation.service';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  now = Date.now();

  links = [
    { path: 'dashboard', label: 'sidenav.dashboard' },
    { path: 'sessions', label: 'sidenav.sessions' },
  ];

  constructor(
    // @Inject(LOCALE_ID) public localeId: LocaleId,
    private translationService: TranslationService
  ) {}

  public get languages() {
    return this.translationService.locales;
  }

  public changeLanguage(lang: LanguageCode) {
    this.translationService.setLocale(lang);
  }
}
