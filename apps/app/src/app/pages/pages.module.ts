import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { ErrorComponent } from './pages/error/error.component';

import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';

/**
 * Load app pages
 */
@NgModule({
  declarations: [PagesComponent, ErrorComponent],
  imports: [SharedModule, PagesRoutingModule],
  providers: [
    {
      provide: Window,
      useValue: window,
    },
  ],
})
export class PagesModule {}
