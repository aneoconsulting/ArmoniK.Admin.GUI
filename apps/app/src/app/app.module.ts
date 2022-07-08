import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslateModule } from './app-translate.module';
import { AppComponent } from './app.component';
import { CoreModule, LanguageService, CustomRouteReuseStrategy } from './core';

/**
 * Load app data
 */
@NgModule({
  imports: [CoreModule, AppRoutingModule, AppTranslateModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
