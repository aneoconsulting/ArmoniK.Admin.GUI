import { Component } from '@angular/core';
import { LanguageCode, LanguageService } from '../shared/util';

@Component({
  selector: 'app-pages-how-to-use',
  templateUrl: './how-to-use.page.html',
  styleUrls: ['./how-to-use.page.scss'],
})
export class HowToUseComponent {
  constructor(private languageService: LanguageService) {}

  isFrench(): boolean {
    return this.languageService.currentLang === LanguageCode.fr;
  }

  isEnglish(): boolean {
    return this.languageService.currentLang === LanguageCode.en;
  }
}
