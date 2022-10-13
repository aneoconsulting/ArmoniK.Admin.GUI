import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { map } from 'rxjs';
import {
  LanguageService,
  Language,
  LanguageCode,
  AppNavLink,
  SettingsService,
  FavoritesService,
} from '../core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  now = Date.now();

  links: AppNavLink[] = [
    {
      path: ['/', 'dashboard'],
      label: this.languageService.instant('navigation.dashboard'),
    },
  ];

  opened = false;
  favoriteName = '';

  public get favorites$() {
    const favorites = this.favoritesService.favorites.pipe(
      map((favorites) => {
        return Array.from(favorites.entries()).map(([path, name]) => {
          return {
            path,
            name,
          };
        });
      })
    );

    return favorites;
  }

  public get currentUrl(): string {
    return this.router.url;
  }

  handleFavorite() {
    if (this.favoritesService.has(this.currentUrl)) {
      this.removeFavorite();
    } else {
      this.openModal();
    }
  }

  openModal(): void {
    this.opened = true;
  }

  closeModal(): void {
    this.opened = false;
  }

  hasFavorite(): boolean {
    return this.favoritesService.has(this.currentUrl);
  }

  addFavorite(): void {
    this.favoritesService.add(this.currentUrl, this.favoriteName);
    this.closeModal();
  }

  removeFavorite(): void {
    this.favoritesService.remove(this.currentUrl);
  }

  constructor(
    private router: Router,
    private languageService: LanguageService,
    public settingsService: SettingsService,
    private favoritesService: FavoritesService,
    public window: Window
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      this.now = Date.now();
    }, 1000 * 60);
  }

  public get languages() {
    return this.languageService.availableLanguages;
  }

  public get currentApplications(): Set<Application['_id']> {
    return this.settingsService.currentApplications;
  }

  /**
   * Remove current application from the list
   *
   * @param application
   */
  removeApplication(application: Application['_id']): void {
    this.settingsService.removeCurrentApplication(application);
    this.router.navigate(['/', 'dashboard']);
  }

  /**
   * Change currant lange of application
   *
   * @param lang
   */
  changeLanguage(lang: LanguageCode): void {
    this.languageService.setLanguageInStorage(lang);
    this.window.location.reload();
  }

  /**
   * Used to know if a language is current
   *
   * @param lang
   *
   * @returns boolean
   */
  isSelected(lang: LanguageCode): boolean {
    return this.languageService.currentLang === lang;
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

  /**
   * Used to track language for ngFor
   *
   * @param index
   * @param item
   *
   * @returns value
   */
  trackByLanguageName(_: number, item: Language): Language['name'] {
    return item.name;
  }

  /**
   * Used to tack current application Id for ngFor
   *
   * @param index
   * @param item
   *
   * @returns value
   */
  trackByApplicationId(_: number, item: Application['_id']): string {
    return `${item.applicationName}${item.applicationVersion}`;
  }
}
