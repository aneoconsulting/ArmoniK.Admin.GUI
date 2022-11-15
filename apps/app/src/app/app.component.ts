import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, first, merge } from 'rxjs';
import {
  AppNavLink,
  ExternalServicesEnum,
  GrafanaService,
  HistoryService,
  LanguageService,
  SeqService,
  SettingsService,
} from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  links: AppNavLink[] = [
    {
      path: ['/', 'dashboard'],
      label: 'navigation.dashboard',
      shape: 'home',
    },
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
      path: ['/', 'errors'],
      label: 'navigation.errors',
      shape: 'error-standard',
    },
  ];

  constructor(
    private _router: Router,
    private _seqService: SeqService,
    private _grafanaService: GrafanaService,
    private _languageService: LanguageService,
    public _settingsService: SettingsService,
    public _historyService: HistoryService,
    public _window: Window
  ) {}

  public get isSeqEnabled(): boolean {
    return this._settingsService.isSeqUp();
  }

  public get isGrafanaEnabled(): boolean {
    return this._settingsService.isGrafanaUp();
  }

  ngOnInit(): void {
    merge(this._seqService.healthCheck$(), this._grafanaService.healthCheck$())
      .pipe(first())
      .subscribe(({ isResponseOk, service }) => {
        if (isResponseOk && service === ExternalServicesEnum.SEQ) {
          this._settingsService.seqEnabled = true;
        }
        if (isResponseOk && service === ExternalServicesEnum.GRAFANA) {
          this._settingsService.grafanaEnabled = true;
        }
      });

    // Add current url to history
    this._historyService.add(this._router.url);
    // Subscribe to router events to track url changes
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        distinctUntilChanged((previous: any, current: any) => {
          return previous.url === current.url;
        })
      )
      .subscribe((event) => {
        this._historyService.add((event as NavigationEnd).urlAfterRedirects);
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
