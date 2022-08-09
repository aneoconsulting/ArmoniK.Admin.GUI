import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslateModule } from './app-translate.module';
import { AppComponent } from './app.component';
import { CoreModule, LanguageService } from './core';

/**
 * Load app data
 */
@NgModule({
  imports: [CoreModule, AppRoutingModule, AppTranslateModule],
  providers: [{ provide: APP_BASE_HREF, useValue: environment.baseHref }],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
