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
    },
    {
      path: ['/', 'sessions'],
      label: this.languageService.instant('navigation.sessions'),
    },
    {
      path: ['/', 'tasks'],
      label: this.languageService.instant('navigation.tasks'),
    },
    {
      path: ['/', 'errors'],
      label: this.languageService.instant('navigation.errors'),
    },
  ];

  constructor(
    private languageService: LanguageService,
    public settingsService: SettingsService,
    public window: Window
  ) {}

  public get isSeqEnabled(): boolean {
    return this.settingsService.isSeqUp();
  }

  public get isGrafanaEnabled(): boolean {
    return this.settingsService.isGrafanaUp();
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
