import { Component, OnInit } from '@angular/core';
import {
  BrowserTitleService,
  LanguageCode,
  LanguageService,
} from '../../../core';

@Component({
  selector: 'app-pages-how-to-use',
  templateUrl: './how-to-use.page.html',
  styleUrls: ['./how-to-use.page.scss'],
})
export class HowToUseComponent implements OnInit {
  constructor(
    private browserTitleService: BrowserTitleService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.browserTitleService.setTitle(
      this.languageService.instant('navigation.how_to_use')
    );
  }

  isFrench(): boolean {
    return this.languageService.currentLang === LanguageCode.fr;
  }

  isEnglish(): boolean {
    return this.languageService.currentLang === LanguageCode.en;
  }
}
