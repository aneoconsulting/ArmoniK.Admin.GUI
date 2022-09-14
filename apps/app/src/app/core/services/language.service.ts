import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LanguageCode } from '../enums';
import { Language } from '../types';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private storageKey = 'lang';
  availableLanguages: Language[] = [
    { code: LanguageCode.en, name: 'en' },
    { code: LanguageCode.fr, name: 'fr' },
    // If adding a new language, don't forget to add it to the translation files and to register locale data
  ];

  constructor(
    private translateService: TranslateService,
    private router: Router
  ) {
    this.translateService.setDefaultLang(LanguageCode.en);
  }

  /**
   * Init language of the application provided by the storage, by the navigator or by the application
   *
   * @param localeId Language code
   *
   */
  init(): void {
    const storageLanguage = this.isAcceptedLanguage(this.storageLanguage)
      ? (this.storageLanguage as LanguageCode)
      : null;
    const navigatorLanguage = this.isAcceptedLanguage(this.navigatorLanguage)
      ? (this.navigatorLanguage as LanguageCode)
      : null;

    const language = storageLanguage || navigatorLanguage || this.fallbackLang;

    // Do not set in storage
    this.translateService.use(language).subscribe(() => {
      this.subscribeToLangChange();
    });
  }

  /**
   * Get the translated value of a key, instantly
   *
   * @param key Key to translate
   * @param params Parameters to use in the translation
   *
   * @returns Translated string
   */
  instant(key: string, params?: Record<string, string | undefined>): string {
    return this.translateService.instant(key, params);
  }

  /**
   * Get the translated value of a key, asynchronously
   *
   * @param key Key to translate
   * @param params Parameters to use in the translation
   *
   * @returns Observable for the translated string
   */
  translate(
    key: string,
    params?: Record<string, string | undefined>
  ): Observable<string> {
    return this.translateService.get(key, params);
  }

  /**
   * Set the language of the application
   *
   * @param lang
   */
  set currentLang(lang: LanguageCode) {
    this.translateService.use(lang);
    this.setLanguageInStorage(lang);
  }

  /**
   * Get the current language of the application
   */
  get currentLang(): LanguageCode {
    return this.translateService.currentLang as LanguageCode;
  }

  /**
   * Get fallback language of the application
   *
   * @returns Fallback language
   */
  get fallbackLang(): LanguageCode {
    return this.translateService.getDefaultLang() as LanguageCode;
  }

  /**
   * Set fallback language of the application
   *
   * @param lang Language code
   */
  set fallbackLang(lang: LanguageCode) {
    this.translateService.setDefaultLang(lang);
  }

  /**
   * Used to subscribe to the language change and update the language of the application
   */
  private subscribeToLangChange(): void {
    this.translateService.onLangChange.subscribe(async () => {
      // Store current strategy to restore it later
      const { shouldReuseRoute } = this.router.routeReuseStrategy;
      // Remove the current route from the router (to prevent the route from being reused)
      /* istanbul ignore next */
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      // Give the router the ability to rebuild the route
      this.router.navigated = false;
      // Rebuild the route
      await this.router.navigateByUrl(this.router.url);
      // Restore the route reuse strategy
      this.router.routeReuseStrategy.shouldReuseRoute = shouldReuseRoute;
    });
  }

  /**
   * Check if the language is accepted by the application
   *
   * @param language Language code
   *
   * @returns True if the language is accepted by the application
   */
  private isAcceptedLanguage(lang?: string): boolean {
    if (!lang) {
      return false;
    }
    return !!this.availableLanguages.find((l) => l.code === lang)?.code;
  }

  /**
   * Set the language in the storage
   * @param lang Language code
   *
   */
  setLanguageInStorage(lang: LanguageCode): void {
    localStorage.setItem(this.storageKey, lang);
  }

  /**
   * Get the language from the storage
   *
   * @returns item find in the storage
   */
  private get storageLanguage(): string | undefined {
    return localStorage.getItem(this.storageKey) as string | undefined;
  }

  /**
   * Get the language from the navigator
   *
   * @returns item find in the navigator
   */
  private get navigatorLanguage(): string | undefined {
    return this.translateService.getBrowserLang() as string | undefined;
  }
}
