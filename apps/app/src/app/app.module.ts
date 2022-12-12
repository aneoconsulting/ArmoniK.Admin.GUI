import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslateModule } from './app-translate.module';
import { AppComponent } from './app.component';
import { LanguageService, CoreModule, RemoveRouteReuseStrategy } from './pages';

/**
 * Load app data
 */
@NgModule({
  imports: [CoreModule, AppRoutingModule, AppTranslateModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: RouteReuseStrategy, useClass: RemoveRouteReuseStrategy },
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
