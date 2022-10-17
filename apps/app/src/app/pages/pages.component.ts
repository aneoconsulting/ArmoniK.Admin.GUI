import { Component, OnInit } from '@angular/core';
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
    public window: Window
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.now = Date.now();
    }, 1000 * 60);
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
