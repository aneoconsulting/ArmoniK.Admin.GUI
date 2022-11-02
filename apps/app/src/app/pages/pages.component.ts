import { Component } from '@angular/core';
import { AppNavLink, LanguageService, SettingsService } from '../core';

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
      shape: 'home',
    },
    {
      path: ['/', 'sessions'],
      label: this.languageService.instant('navigation.sessions'),
      shape: 'nodes',
    },
    {
      path: ['/', 'tasks'],
      label: this.languageService.instant('navigation.tasks'),
      shape: 'node',
    },
    {
      path: ['/', 'errors'],
      label: this.languageService.instant('navigation.errors'),
      shape: 'error-standard',
    },
  ];

  constructor(
    private languageService: LanguageService,
    public settingsService: SettingsService,
    public window: Window
  ) {}

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
