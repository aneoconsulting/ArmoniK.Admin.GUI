import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs';
import { AppNavLink, LanguageService, SettingsService } from '../core';
import { HistoryService } from '../core/services/history.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
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
    private _router: Router,
    private languageService: LanguageService,
    public settingsService: SettingsService,
    public historyService: HistoryService,
    public window: Window
  ) {}

  ngOnInit(): void {
    // Add current url to history
    this.historyService.add(this._router.url);
    // Subscribe to router events to track url changes
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged((previous: any, current: any) => {
          return previous.url === current.url;
        })
      )
      .subscribe((event) => {
        this.historyService.add((event as NavigationEnd).urlAfterRedirects);
      });
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
