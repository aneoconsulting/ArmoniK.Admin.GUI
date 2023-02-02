import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  ExternalServicesEnum,
  HealthCheckService,
  User,
} from '@armonik.admin.gui/shared/data-access';
import { Observable, distinctUntilChanged, filter, merge, take } from 'rxjs';
import { AuthService } from './shared/data-access/auth.service';
import { AppNavLink, HistoryService, SettingsService } from './shared/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public loadingUser = false;

  dataLinks: AppNavLink[] = [
    {
      path: ['/', 'applications'],
      label: $localize`Applications`,
      queryParams: { page: 0, pageSize: 10 },
      shape: 'bundle',
    },
    {
      path: ['/', 'partitions'],
      label: $localize`Partitions`,
      shape: 'objects',
    },
  ];

  computedLinks: AppNavLink[] = [
    {
      path: ['/', 'sessions'],
      label: $localize`Sessions`,
      queryParams: { page: 0, pageSize: 10 },
      shape: 'nodes',
    },
    {
      path: ['/', 'tasks'],
      label: $localize`Tasks`,
      shape: 'node',
    },
    {
      path: ['/', 'results'],
      label: $localize`Results`,
      shape: 'certificate',
    },
  ];

  constructor(
    private _router: Router,
    private _healthCheckService: HealthCheckService,
    private _historyService: HistoryService,
    private _authService: AuthService,
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

  public get currentUser(): User | null {
    return this._authService.user;
  }

  public get loadingCurrentUser$(): Observable<boolean> {
    return this._authService.loading$;
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
