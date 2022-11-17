import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '@armonik.admin.gui/ui';
import {
  ClrIconModule,
  ClrMainContainerModule,
  ClrVerticalNavModule,
} from '@clr/angular';
import {
  DEFAULT_LANGUAGE,
  FakeMissingTranslationHandler,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateDefaultParser,
  TranslateFakeCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE,
} from '@ngx-translate/core';
import { distinctUntilChanged, filter, first, merge } from 'rxjs';
import { environment } from '../environments/environment';
import {
  AppNavLink,
  CoreModule,
  ExternalServicesEnum,
  GrafanaService,
  HistoryService,
  LanguageService,
  SeqService,
  SettingsService,
} from './core';
import {
  ApplicationsSubnavComponent,
  LanguagesSelectorComponent,
  NavigationHistoryComponent,
  TimeComponent,
} from './pages/components';
import {
  ModalFavoritesComponent,
  NavigationFavoritesComponent,
} from './pages/pages/components';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    CoreModule,
    HeaderComponent,
    CommonModule,
    ModalFavoritesComponent,
    NavigationFavoritesComponent,
    TimeComponent,
    LanguagesSelectorComponent,
    TranslateModule,
    ClrIconModule,
    NavigationHistoryComponent,
    ApplicationsSubnavComponent,
    ClrVerticalNavModule,
    ClrMainContainerModule,
  ],
  providers: [
    TranslateService,
    TranslateStore,
    { provide: TranslateLoader, useClass: TranslateFakeLoader },
    { provide: TranslateCompiler, useClass: TranslateFakeCompiler },
    { provide: TranslateParser, useClass: TranslateDefaultParser },
    {
      provide: MissingTranslationHandler,
      useClass: FakeMissingTranslationHandler,
    },
    { provide: USE_STORE, useValue: {} },
    { provide: USE_DEFAULT_LANG, useValue: {} },
    { provide: USE_EXTEND, useValue: {} },
    { provide: DEFAULT_LANGUAGE, useValue: {} },
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: Window, useFactory: () => window },
  ],
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
    this._languageService.init();

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
