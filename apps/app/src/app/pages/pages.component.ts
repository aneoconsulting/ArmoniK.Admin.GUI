import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import {
  LanguageService,
  Language,
  LanguageCode,
  AppNavLink,
  SettingsService,
} from '../core';

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

  constructor(
    private router: Router,
    private languageService: LanguageService,
    public settingsService: SettingsService
  ) {
    setInterval(() => {
      this.now = Date.now();
    }, 1000 * 60);
  }

  public get languages() {
    return this.languageService.availableLanguages;
  }

  public get currentApplications(): Set<Application['_id']> {
    return this.settingsService.currentApplications;
  }

  /**
   * Remove current application from the list
   *
   * @param application
   */
  public removeApplication(application: Application['_id']) {
    this.settingsService.removeCurrentApplication(application);
    this.router.navigate(['/admin', 'dashboard']);
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

  /**
   * Used to tack current application Id for ngFor
   *
   * @param index
   * @param item
   *
   * @returns value
   */
  public trackByApplicationId(_: number, item: Application['_id']): string {
    return item.applicationName + item.applicationVersion;
  }
}
