import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { GrpcAuthService } from '@armonik.admin.gui/auth/data-access';
import { HealthCheckService } from '@armonik.admin.gui/shared/data-access';
import {
  ClarityIcons,
  angleIcon,
  bundleIcon,
  certificateIcon,
  crosshairsIcon,
  eyeIcon,
  filterGridIcon,
  helpIcon,
  historyIcon,
  infoCircleIcon,
  lineChartIcon,
  newIcon,
  nodeIcon,
  nodesIcon,
  starIcon,
  timesIcon,
  userIcon,
} from '@cds/core/icon';
import '@cds/core/icon/register.js';
import {
  ClrIconModule,
  ClrLayoutModule,
  ClrVerticalNavModule,
} from '@clr/angular';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanActivateUser } from './shared/data-access';
import { AuthService } from './shared/data-access/auth.service';
import {
  TheFavoritesNavigationComponent,
  TheHeaderTimeComponent,
  TheHistoryNavigationComponent,
} from './shared/feature';
import { TheFavoritesModalComponent, TheHeaderComponent } from './shared/ui';
import { CoreModule, RemoveRouteReuseStrategy } from './shared/util';

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
    BrowserModule,
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
  constructor() {
    ClarityIcons.addIcons(
      userIcon,
      crosshairsIcon,
      bundleIcon,
      lineChartIcon,
      angleIcon,
      helpIcon,
      newIcon,
      nodesIcon,
      filterGridIcon,
      nodeIcon,
      eyeIcon,
      timesIcon,
      infoCircleIcon,
      historyIcon,
      starIcon,
      certificateIcon
    );
  }
}
