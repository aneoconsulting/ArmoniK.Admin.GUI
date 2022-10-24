import { Component } from '@angular/core';
import {
  AppNavLink,
  LanguageCode,
  LanguageService,
  SettingsService,
} from '../core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  links: AppNavLink[] = [
    {
      path: ['/', 'dashboard'],
      label: this.languageService.instant('navigation.dashboard'),
      queryParams: {},
    },
    {
      path: ['/', 'sessions'],
      label: this.languageService.instant('navigation.sessions'),
      queryParams: { autoRefresh: true, page: 0, pageSize: 10 },
    },
    {
      path: ['/', 'tasks'],
      label: this.languageService.instant('navigation.tasks'),
      queryParams: {},
    },
    {
      path: ['/', 'errors'],
      label: this.languageService.instant('navigation.errors'),
      queryParams: {},
    },
  ];

  constructor(
    private languageService: LanguageService,
    public settingsService: SettingsService,
    public window: Window
  ) {}

  /**
   * Used to know if a language is current
   *
   * @param lang
   *
   * @returns boolean
   */
  isSelected(lang: LanguageCode): boolean {
    return this.languageService.currentLang === lang;
  }

  /** Used to track label
   *
   * @param index
   * @param item
   *
   * @returns value
   */
  trackByLabel(_: number, item: AppNavLink): AppNavLink['label'] {
    return item.label;
  }
}
