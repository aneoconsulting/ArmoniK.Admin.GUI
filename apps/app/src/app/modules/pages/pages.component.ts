import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
  ];

  constructor(
    private translationService: TranslationService,
    private translateService: TranslateService
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
}
