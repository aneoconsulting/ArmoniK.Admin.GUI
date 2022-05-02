import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { LocaleProvider } from './modules/core/providers/locale.provider';
import { PagesComponent } from './modules/pages/pages.component';
import { PagesModule } from './modules/pages/pages.module';

registerLocaleData(localeFr, 'fr');

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RouterModule.forRoot([
      { path: '*', children: [{ path: '*', component: PagesComponent }] },
    ]),
    UiModule,
    PagesModule,
    ClarityModule,
  ],
  providers: [LocaleProvider],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
