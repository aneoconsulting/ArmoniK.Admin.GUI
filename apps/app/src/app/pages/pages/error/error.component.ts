import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserTitleService, LanguageService } from '../../../core';

@Component({
  standalone: true,
  selector: 'app-pages-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  imports: [TranslateModule],
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
