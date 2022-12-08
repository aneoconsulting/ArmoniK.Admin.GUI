import { NgModule } from '@angular/core';
import {
  ClrIconModule,
  ClrLayoutModule,
  ClrVerticalNavModule,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  TheApplicationsSubnavComponent,
  TheFavoritesModalComponent,
  TheFavoritesNavigationComponent,
  TheHeaderTimeComponent,
  TheHistoryNavigationComponent,
  TheLanguagesSelectorComponent,
} from './feature';
import { TheHeaderComponent } from './ui';

import '@clr/icons';
import '@clr/icons/shapes/chart-shapes';
import '@clr/icons/shapes/essential-shapes';
import '@clr/icons/shapes/social-shapes';
import '@clr/icons/shapes/technology-shapes';

/**
 * Load app pages
 */
@NgModule({
  declarations: [PagesComponent],
  imports: [
    ClrLayoutModule,
    ClrVerticalNavModule,
    ClrIconModule,
    TranslateModule,
    PagesRoutingModule,
    TheApplicationsSubnavComponent,
    TheLanguagesSelectorComponent,
    TheHeaderComponent,
    TheHistoryNavigationComponent,
    TheFavoritesNavigationComponent,
    TheFavoritesModalComponent,
    TheHeaderTimeComponent,
    AsyncPipe,
    NgFor,
    NgIf,
  ],
  providers: [
    {
      provide: Window,
      useValue: window,
    },
  ],
})
export class PagesModule {}
