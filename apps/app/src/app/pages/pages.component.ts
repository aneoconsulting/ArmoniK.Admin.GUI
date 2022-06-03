import { Component } from '@angular/core';
import { LanguageService, Language, LanguageCode, AppNavLink } from '../core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  now = Date.now();

  links: AppNavLink[] = [
    {
      path: 'dashboard',
      label: this.languageService.instant('navigation.dashboard'),
    },
  ];

  constructor(private languageService: LanguageService) {
    setInterval(() => {
      this.now = Date.now();
    }, 1000 * 60);
  }

  public get languages() {
    return this.languageService.availableLanguages;
  }

  /**
   * Change currant lange of application
   *
   * @param lang
   */
  public changeLanguage(lang: LanguageCode) {
    this.languageService.currentLang = lang;
  }

  /** Used to track label
   *
   * @param index
   * @param item
   *
   * @returns value
   */
  public trackByLabel(_: number, item: AppNavLink): AppNavLink['label'] {
    return item.label;
  }

  /**
   * Used to track language for ngFor
   *
   * @param index
   * @param item
   *
   * @returns value
   */
  public trackByLanguageName(_: number, item: Language): Language['name'] {
    return item.name;
  }
}
