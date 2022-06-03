import { Component } from '@angular/core';
import { BrowserTitleService, LanguageService } from '../../../core';

@Component({
  selector: 'app-pages-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  constructor(
    private browserTitleService: BrowserTitleService,
    private languageService: LanguageService
  ) {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.error.title')
    );
  }
}
