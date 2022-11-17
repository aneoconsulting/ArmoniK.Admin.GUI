import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Language, LanguageCode, LanguageService } from '../../../core';

@Component({
  standalone: true,
  selector: 'app-pages-languages-selector',
  templateUrl: './languages-selector.component.html',
  styleUrls: ['./languages-selector.component.scss'],
  imports: [CommonModule],
})
export class LanguagesSelectorComponent {
  constructor(
    private _languageService: LanguageService,
    private _window: Window
  ) {}

  public get languages() {
    return this._languageService.availableLanguages;
  }

  /**
   * Change current language of application
   *
   * @param lang
   */
  changeTo(lang: LanguageCode): void {
    this._languageService.setLanguageInStorage(lang);
    this._window.location.reload();
  }

  /**
   * Used to know if a language is current
   *
   * @param lang
   *
   * @returns boolean
   */
  isSelected(lang: LanguageCode): boolean {
    return this._languageService.currentLang === lang;
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
}
