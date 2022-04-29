import { Component } from '@angular/core';
import {
  LanguageCode,
  LanguageService,
} from '../services/languageService/language.service';

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

  constructor(public languageService: LanguageService) {}

  public changeLanguage(lang: LanguageCode) {
    this.languageService.setLanguage(lang);
  }
}
