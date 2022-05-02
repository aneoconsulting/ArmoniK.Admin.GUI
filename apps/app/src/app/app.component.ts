import { Component } from '@angular/core';
import {
  LanguageCode,
  TranslationService,
} from './modules/core/services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private translationService: TranslationService) {
    this.translationService.initLocale(LanguageCode.EN);
  }
}
