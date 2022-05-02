import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { SessionsComponent } from './modules/sessions/sessions.component';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    ClarityModule,
    UiModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      {
        path: 'admin',
        component: PagesComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'sessions', component: SessionsComponent },
          {
            path: 'dashboard',
            loadChildren: () =>
              import('./modules/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
              ),
          },
        ],
      },
    ]),
  ],
})
export class PagesModule {}
