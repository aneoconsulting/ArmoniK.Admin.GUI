import { Component, OnInit } from '@angular/core';
import { LanguageService } from './modules/services/languageService/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.initLanguage();
  }
}
