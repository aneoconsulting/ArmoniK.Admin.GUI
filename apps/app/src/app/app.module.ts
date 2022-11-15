import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslateModule } from './app-translate.module';
import { AppComponent } from './app.component';
import { CoreModule, LanguageService, RemoveRouteReuseStrategy } from './core';
import {
  ApplicationsSubnavComponent,
  LanguagesSelectorComponent,
  NavigationHistoryComponent,
  TimeComponent,
} from './pages/components';
import {
  ModalFavoritesComponent,
  NavigationFavoritesComponent,
} from './pages/pages/components';
import { ErrorComponent } from './pages/pages/error/error.component';
import { SharedModule } from './shared';

import '@clr/icons';
import '@clr/icons/shapes/chart-shapes';
import '@clr/icons/shapes/essential-shapes';
import '@clr/icons/shapes/social-shapes';
import '@clr/icons/shapes/technology-shapes';

/**
 * Load app data
 */
@NgModule({
  imports: [CoreModule, SharedModule, AppRoutingModule, AppTranslateModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: RouteReuseStrategy, useClass: RemoveRouteReuseStrategy },
    { provide: Window, useFactory: () => window },
  ],
  declarations: [
    AppComponent,
    ErrorComponent,
    ApplicationsSubnavComponent,
    LanguagesSelectorComponent,
    NavigationHistoryComponent,
    ModalFavoritesComponent,
    NavigationFavoritesComponent,
    TimeComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
