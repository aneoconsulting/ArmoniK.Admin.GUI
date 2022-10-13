import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { ErrorComponent } from './pages';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

import '@clr/icons';
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
    NavigationFavoritesComponent,
    ModalFavoritesComponent,
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
