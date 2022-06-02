import { NgModule } from '@angular/core';
import { LanguageService, LocaleProvider } from '../core';
import { SharedModule } from '../shared';
import { ErrorComponent } from './error/error.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesTranslateModule } from './pages-translate.module';
import { PagesComponent } from './pages.component';

/**
 * Load app pages
 */
@NgModule({
  declarations: [PagesComponent, ErrorComponent],
  imports: [SharedModule, PagesRoutingModule, PagesTranslateModule],
  providers: [LocaleProvider, LanguageService],
})
export class PagesModule {
  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
