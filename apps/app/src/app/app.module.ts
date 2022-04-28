import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { AppComponent } from './app.component';
import { PagesComponent } from './modules/pages/pages.component';
import { PagesModule } from './modules/pages/pages.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path: '*',
        component: AppComponent,
        children: [{ path: '*', component: PagesComponent }],
      },
    ]),
    UiModule,
    PagesModule,
    ClarityModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
