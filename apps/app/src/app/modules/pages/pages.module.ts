import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { PagesComponent } from './pages.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import * as components from './components';

import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';
import { AppSettingsService } from '../core/services';
import { ApplicationsService } from '../core/services/http';

@NgModule({
  declarations: [
    PagesComponent,
    components.PagesApplicationsComponent,
    components.PagesApplicationsModalComponent,
  ],
  imports: [
    CommonModule,
    ClarityModule,
    UiModule,
    FlexLayoutModule,
    FormsModule,
    TranslateModule.forChild(),
    RouterModule.forChild([
      {
        path: '',
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
  providers: [AppSettingsService, ApplicationsService],
})
export class PagesModule {}
