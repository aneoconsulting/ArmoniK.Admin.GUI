import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClrIconModule } from '@clr/angular';
import {
  BrowserTitleService,
  LanguageCode,
  LanguageService,
} from '../../../core';

@Component({
  standalone: true,
  selector: 'app-pages-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss'],
  imports: [CommonModule, ClrIconModule],
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
