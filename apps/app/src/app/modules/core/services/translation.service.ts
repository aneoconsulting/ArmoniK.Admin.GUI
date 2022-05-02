import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { noop } from 'rxjs';

export enum LanguageCode {
  EN = 'en',
  FR = 'fr',
}

type Language = {
  code: LanguageCode;
  name: string;
};

type ShouldReuseRoute = (
  future: ActivatedRouteSnapshot,
  curr: ActivatedRouteSnapshot
) => boolean;

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  constructor(
    private translateService: TranslateService,
    private router: Router
  ) {}

  private languages: Language[] = [
    { code: LanguageCode.EN, name: 'en' },
    { code: LanguageCode.FR, name: 'fr' },
    // If adding a new language, don't forget to add it to the translation files and to register locale data
  ];

  get locales() {
    return this.languages;
  }

  private storageKey = 'lang';

  /**
   * Default language provided by the storage, by the navigator or by the application
   */
  initLocale(localeId: string) {
    const defaultLocaleId =
      this.getLanguageFromStorage() ||
      this.getLanguageFromNavigator() ||
      localeId;
    this.setDefaultLocale(defaultLocaleId);
    this.translateService.use(defaultLocaleId);
    this.subscribeToLangChange();
  }

  setDefaultLocale(localeId: string) {
    this.translateService.setDefaultLang(localeId);
  }

  setLocale(localeId: LanguageCode) {
    this.translateService.use(localeId);
    this.setLanguageToStorage(localeId);
  }

  get currentLocale() {
    return this.translateService.currentLang;
  }

  private subscribeToLangChange() {
    this.translateService.onLangChange.subscribe(async () => {
      // Store current strategy to restore it later
      const { shouldReuseRoute } = this.router.routeReuseStrategy;
      // Remove the current route from the router (to prevent the route from being reused)
      this.setRouteReuse(() => false);
      // Give the router the ability to rebuild the route
      this.router.navigated = false;
      // Rebuild the route
      await this.router.navigateByUrl(this.router.url).catch(noop);
      // Restore the route reuse strategy
      this.setRouteReuse(shouldReuseRoute);
    });
  }

  private setRouteReuse(reuse: ShouldReuseRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = reuse;
  }

  private setLanguageToStorage(lang: LanguageCode) {
    localStorage.setItem(this.storageKey, lang);
  }

  private getLanguageFromStorage() {
    return localStorage.getItem(this.storageKey) as LanguageCode | undefined;
  }

  private getLanguageFromNavigator() {
    return this.translateService.getBrowserLang();
  }
}
