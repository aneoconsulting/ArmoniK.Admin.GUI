import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsComponent } from './sessions.component';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';
import { SessionDetailComponent, TasksListComponent } from './components';
import { CoreComponentsModule, SessionsService } from '../../../core/';
import { UiModule } from '@armonik.admin.gui/ui';

@NgModule({
  declarations: [SessionsComponent, TasksListComponent, SessionDetailComponent],
  providers: [SessionsService],
  imports: [
    CommonModule,
    ClarityModule,
    CoreComponentsModule,
    UiModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: ':application/sessions',
        component: SessionsComponent,
      },
      {
        path: ':application/sessions/:session',
        component: SessionDetailComponent,
      },
      {
        path: ':application/sessions/:session/tasks/:task',
        loadChildren: () =>
          import('./modules/tasks/tasks.module').then((m) => m.TasksModule),
      },
    ]),
  ],
})
export class SessionsModule {}
