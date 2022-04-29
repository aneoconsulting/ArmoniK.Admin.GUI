import { Component } from '@angular/core';
import {
  LanguageCode,
  TranslationService,
} from '../core/services/translation/translation.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent {
  links = [
    { path: 'dashboard', label: 'sidenav.dashboard' },
    { path: 'sessions', label: 'sidenav.sessions' },
  ];

  constructor(private translationService: TranslationService) {}

  public get languages() {
    return this.translationService.getLanguages();
  }

  public changeLanguage(lang: LanguageCode) {
    this.translationService.setLanguage(lang);
  }
}
