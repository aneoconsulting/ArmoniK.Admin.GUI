import { APP_BASE_HREF, CommonModule } from '@angular/common';
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
import {
  ClrIconModule,
  ClrMainContainerModule,
  ClrVerticalNavModule,
} from '@clr/angular';
import { HeaderComponent } from '@armonik.admin.gui/ui';

/**
 * Load app data
 */
@NgModule({
  imports: [
    CoreModule,
    HeaderComponent,
    CommonModule,
    ClrMainContainerModule,
    ClrVerticalNavModule,
    ClrIconModule,
    AppRoutingModule,
    AppTranslateModule,
    ApplicationsSubnavComponent,
    LanguagesSelectorComponent,
    NavigationHistoryComponent,
    ModalFavoritesComponent,
    NavigationFavoritesComponent,
    TimeComponent,
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: RouteReuseStrategy, useClass: RemoveRouteReuseStrategy },
    { provide: Window, useFactory: () => window },
  ],
  declarations: [AppComponent, ErrorComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
