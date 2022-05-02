import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LocaleProvider } from '../core/providers/locale.provider';
import { TranslationService } from '../core/services/translation.service';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { SessionsComponent } from './modules/sessions/sessions.component';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [PagesComponent],
  providers: [TranslationService, LocaleProvider],
  imports: [
    CommonModule,
    ClarityModule,
    UiModule,
    FlexLayoutModule,
    TranslateModule.forChild(),
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
