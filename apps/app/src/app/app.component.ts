import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  ExternalServicesEnum,
  HealthCheckService,
} from '@armonik.admin.gui/shared/data-access';
import { distinctUntilChanged, filter, merge, take } from 'rxjs';
import { AppNavLink, HistoryService, SettingsService } from './shared/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  links: AppNavLink[] = [
    {
      path: ['/', 'applications'],
      label: 'navigation.applications',
      queryParams: { page: 0, pageSize: 10 },
      shape: 'bundle',
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
      path: ['/', 'results'],
      label: 'navigation.results',
      shape: 'certificate',
    },
  ];

  constructor(
    private _router: Router,
    private _healthCheckService: HealthCheckService,
    private _historyService: HistoryService,
    public settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    merge(
      this._healthCheckService.healthCheck$('/seq', ExternalServicesEnum.SEQ),
      this._healthCheckService.healthCheck$(
        '/grafana',
        ExternalServicesEnum.GRAFANA
      )
    )
      .pipe(take(2))
      .subscribe(({ isResponseOk, service }) => {
        if (isResponseOk && service === ExternalServicesEnum.SEQ) {
          this.settingsService.seqSubject$.next(true);
        }
        if (isResponseOk && service === ExternalServicesEnum.GRAFANA) {
          this.settingsService.grafanaSubject$.next(true);
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
