import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../core/services';
import { ApplicationsService } from '../core/services/http';
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
export class PagesComponent implements OnInit {
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
    private route: ActivatedRoute,
    private translationService: TranslationService,
    private translateService: TranslateService,
    private applicationsService: ApplicationsService,
    private appSettingsService: AppSettingsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const applicationId = params.get('application');
      if (applicationId) {
        this.applicationsService
          .show(applicationId)
          .subscribe((application) => {
            this.appSettingsService.setActiveApplication(application);
          });
      }
    });
  }

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
