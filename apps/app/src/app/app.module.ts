import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { GrpcAuthService } from '@armonik.admin.gui/auth/data-access';
import { HealthCheckService } from '@armonik.admin.gui/shared/data-access';
import {
  ClrIconModule,
  ClrLayoutModule,
  ClrVerticalNavModule,
} from '@clr/angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslateModule } from './app-translate.module';
import { AppComponent } from './app.component';
import { AuthService } from './shared/data-access/auth.service';
import {
  TheFavoritesNavigationComponent,
  TheHeaderTimeComponent,
  TheHistoryNavigationComponent,
  TheLanguagesSelectorComponent,
} from './shared/feature';
import { TheHeaderComponent, TheFavoritesModalComponent } from './shared/ui';
import {
  CoreModule,
  LanguageService,
  RemoveRouteReuseStrategy,
} from './shared/util';
import { CanActivateUser } from './shared/data-access';

import '@clr/icons';
import '@clr/icons/shapes/chart-shapes';
import '@clr/icons/shapes/essential-shapes';
import '@clr/icons/shapes/social-shapes';
import '@clr/icons/shapes/technology-shapes';

/**
 * Load app data
 */
@NgModule({
  imports: [
    ClrLayoutModule,
    ClrVerticalNavModule,
    ClrIconModule,
    CoreModule,
    AppRoutingModule,
    RouterModule,
    AppTranslateModule,
    BrowserModule,
    TheLanguagesSelectorComponent,
    TheHeaderComponent,
    TheHistoryNavigationComponent,
    TheFavoritesNavigationComponent,
    TheFavoritesModalComponent,
    TheHeaderTimeComponent,
  ],

  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseHref },
    { provide: RouteReuseStrategy, useClass: RemoveRouteReuseStrategy },
    { provide: Window, useValue: window },
    AuthService,
    GrpcAuthService,
    HealthCheckService,
    CanActivateUser,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
