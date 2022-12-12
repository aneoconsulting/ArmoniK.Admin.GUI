import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs';
import { AppNavLink, HistoryService, SettingsService } from './util';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  links: AppNavLink[] = [
    {
      path: ['/', 'sessions'],
      label: 'navigation.sessions',
      queryParams: { page: 0, pageSize: 10 },
      shape: 'nodes',
    },
    {
      path: ['/', 'tasks'],
      label: 'navigation.tasks',
      shape: 'node',
    },
    {
      path: ['/', 'results'],
      label: 'navigation.results',
      shape: 'certificate',
    },
  ];

  constructor(
    private _router: Router,
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
