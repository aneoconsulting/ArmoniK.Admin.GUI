import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { PagesComponent } from './pages.component';
import * as components from './components';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';

@NgModule({
  declarations: [PagesComponent, components.PagesApplicationsComponent],
  imports: [
    CommonModule,
    ClarityModule,
    UiModule,
    FlexLayoutModule,
    FormsModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      {
        path: 'admin',
        component: PagesComponent,
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          {
            path: 'tasks',
            loadChildren: () =>
              import('./modules/tasks/tasks.module').then((m) => m.TasksModule),
          },
          {
            path: 'applications',
            loadChildren: () =>
              import('./modules/applications/applications.module').then(
                (m) => m.ApplicationsModule
              ),
          },
          {
            path: 'sessions',
            loadChildren: () =>
              import('./modules/sessions/sessions.module').then(
                (m) => m.SessionsModule
              ),
          },
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
