import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/languageService/language.service';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SessionsComponent } from './modules/sessions/sessions.component';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent],
  providers: [LanguageService],
  imports: [
    CommonModule,
    ClarityModule,
    UiModule,
    FlexLayoutModule,
    TranslateModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      {
        path: 'admin',
        component: PagesComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'sessions', component: SessionsComponent },
          { path: 'dashboard', component: DashboardComponent },
        ],
      },
    ]),
  ],
})
export class PagesModule {}
