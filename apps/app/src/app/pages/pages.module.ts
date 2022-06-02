import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';
import { ErrorComponent } from './error/error.component';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';

/**
 * Load app pages
 */
@NgModule({
  declarations: [PagesComponent, ErrorComponent],
  imports: [SharedModule, PagesRoutingModule],
})
export class PagesModule {}
