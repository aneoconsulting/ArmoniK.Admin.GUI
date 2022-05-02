import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  LanguageCode,
  TranslationService,
} from '../core/services/translation.service';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  now = Date.now();

  links = [
    {
      path: 'dashboard',
      label: this.translateService.get('sidenav.dashboard'),
    },
    { path: 'sessions', label: this.translateService.get('sidenav.sessions') },
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
}
