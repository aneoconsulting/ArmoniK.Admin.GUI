import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { ErrorComponent } from './pages';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';
import { ApplicationsSubnavComponent } from './components';

/**
 * Load app pages
 */
@NgModule({
  declarations: [PagesComponent, ErrorComponent, ApplicationsSubnavComponent],
  imports: [SharedModule, PagesRoutingModule],
  providers: [
    {
      provide: Window,
      useValue: window,
    },
  ],
})
export class PagesModule {}
