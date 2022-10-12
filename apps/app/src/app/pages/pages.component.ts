import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import {
  AppNavLink,
  Language,
  LanguageCode,
  LanguageService,
  SettingsService,
} from '../core';
import { HistoryService } from '../core/services/history.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  now = Date.now();

  links: AppNavLink[] = [
    {
      path: ['/', 'dashboard'],
      label: this.languageService.instant('navigation.dashboard'),
    },
  ];

  constructor(
    private router: Router,
    private languageService: LanguageService,
    public settingsService: SettingsService,
    public historyService: HistoryService,
    public window: Window
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.now = Date.now();
    }, 1000 * 60);

    // Add current url to history
    this.historyService.add(this.router.url);
    // Subscribe to router events to track url changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.historyService.add(event.urlAfterRedirects);
      }
    });
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
  removeApplication(application: Application['_id']): void {
    this.settingsService.removeCurrentApplication(application);
    this.router.navigate(['/', 'dashboard']);
  }

  /**
   * Change currant lange of application
   *
   * @param lang
   */
  changeLanguage(lang: LanguageCode): void {
    this.languageService.setLanguageInStorage(lang);
    this.window.location.reload();
  }

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

  /**
   * Used to track language for ngFor
   *
   * @param index
   * @param item
   *
   * @returns value
   */
  trackByLanguageName(_: number, item: Language): Language['name'] {
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
  trackByApplicationId(_: number, item: Application['_id']): string {
    return `${item.applicationName}${item.applicationVersion}`;
  }
}
