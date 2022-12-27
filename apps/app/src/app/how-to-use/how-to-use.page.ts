import { Component, OnInit } from '@angular/core';
import { BrowserTitleService } from '../shared/util';

@Component({
  selector: 'app-pages-how-to-use',
  templateUrl: './how-to-use.page.html',
  styleUrls: ['./how-to-use.page.scss'],
})
export class HowToUseComponent implements OnInit {
  constructor(private browserTitleService: BrowserTitleService) {}

  ngOnInit(): void {
    this.browserTitleService.setTitle('How to use');
  }
}
