import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslateModule } from './app-translate.module';
import { AppComponent } from './app.component';
import { CoreModule, LanguageService, LocaleProvider } from './core';
import { SharedModule } from './shared';

/**
 * Used to load the app's data
 */
@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    AppTranslateModule,
    AppRoutingModule,
  ],
  providers: [LocaleProvider],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
