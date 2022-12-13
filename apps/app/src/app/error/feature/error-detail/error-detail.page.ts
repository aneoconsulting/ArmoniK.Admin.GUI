import { Component } from '@angular/core';
import { BrowserTitleService, LanguageService } from '../../../shared/util';

@Component({
  selector: 'app-pages-error-detail',
  templateUrl: './error-detail.page.html',
  styleUrls: ['./error-detail.page.scss'],
})
export class ErrorDetailComponent {
  constructor(
    private browserTitleService: BrowserTitleService,
    private languageService: LanguageService
  ) {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.error.title')
    );
  }
}
