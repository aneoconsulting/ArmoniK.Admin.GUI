import { Component, OnInit } from '@angular/core';
import { BrowserTitleService, LanguageService } from '../../../core';

@Component({
  selector: 'app-pages-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.scss'],
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
}
