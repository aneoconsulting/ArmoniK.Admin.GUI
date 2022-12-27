import { Component } from '@angular/core';
import { BrowserTitleService } from '../../../shared/util';

@Component({
  selector: 'app-pages-error-detail',
  templateUrl: './error-detail.page.html',
  styleUrls: ['./error-detail.page.scss'],
})
export class ErrorDetailComponent {
  constructor(private browserTitleService: BrowserTitleService) {
    this.browserTitleService.setTitle('Error');
  }
}
