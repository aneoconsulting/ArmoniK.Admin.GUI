import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  param = { value: 'world' };

  languages: any;

  lang: string | undefined;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.lang = this.translateService.getBrowserLang();
    this.languages = this.translateService.getLangs();
  }
}
