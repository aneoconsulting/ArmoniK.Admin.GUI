import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import {
  ApplicationsSubnavComponent,
  LanguagesSelectorComponent,
  TimeComponent,
} from './components';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ErrorComponent } from './pages/error/error.component';

import '@clr/icons';
import '@clr/icons/shapes/chart-shapes';
import '@clr/icons/shapes/essential-shapes';
import '@clr/icons/shapes/social-shapes';
import {
  ModalFavoritesComponent,
  NavigationFavoritesComponent,
} from './pages/components';

/**
 * Load app pages
 */
@NgModule({
  declarations: [
    PagesComponent,
    ErrorComponent,
    ApplicationsSubnavComponent,
    LanguagesSelectorComponent,
    ModalFavoritesComponent,
    NavigationFavoritesComponent,
    TimeComponent,
  ],
  imports: [SharedModule, PagesRoutingModule],
  providers: [
    {
      provide: Window,
      useValue: window,
    },
  ],
})
export class PagesModule {}
