import { Component } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../core/services';
import {
  Language,
  LanguageCode,
  TranslationService,
} from '../core/services/translation.service';

type Link = {
  path: string;
  label: string;
};
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  now = Date.now();

  links: Link[] = [
    {
      path: 'dashboard',
      label: this.translateService.instant('sidenav.dashboard'),
    },
    {
      path: 'sessions',
      label: this.translateService.instant('sidenav.sessions'),
    },
    {
      path: 'tasks',
      label: this.translateService.instant('sidenav.tasks'),
    },
    {
      path: 'applications',
      label: this.translateService.instant('sidenav.applications'),
    },
  ];

  constructor(
    private translationService: TranslationService,
    private translateService: TranslateService,
    private appSettingsService: AppSettingsService
  ) {}

  public get languages() {
    return this.translationService.locales;
  }

  public changeLanguage(lang: LanguageCode) {
    this.translationService.setLocale(lang);
  }

  public trackByLabel(_: number, item: Link): string {
    return item.label;
  }

  public trackByLanguageName(_: number, item: Language): string {
    return item.name;
  }

  public get currentApplications(): Application[] {
    return this.appSettingsService.currentApplications;
  }

  public onAddApplication(application: Application): void {
    this.addCurrentApplication(application);
  }

  public onRemoveApplication(application: Application): void {
    this.removeCurrentApplication(application);
  }

  private addCurrentApplication(application: Application): void {
    this.appSettingsService.addCurrentApplication(application);
  }

  private removeCurrentApplication(application: Application): void {
    this.appSettingsService.removeCurrentApplication(application);
  }
}
