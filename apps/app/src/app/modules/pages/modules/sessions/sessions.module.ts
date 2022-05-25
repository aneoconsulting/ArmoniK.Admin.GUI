import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsComponent } from './sessions.component';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';
import { SessionDetailComponent, TasksListComponent } from './components';
import { SessionsService } from '../../../core/';

@NgModule({
  declarations: [SessionsComponent, TasksListComponent, SessionDetailComponent],
  providers: [SessionsService],
  imports: [
    CommonModule,
    ClarityModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: ':application/sessions',
        component: SessionsComponent,
      },
      {
        path: ':application/sessions/:id/tasks',
        component: SessionDetailComponent,
      },
      {
        path: ':application/sessions/:id/tasks/:taskId',
        loadChildren: () =>
          import('./modules/tasks/tasks.module').then((m) => m.TasksModule),
      },
    ]),
  ],
})
export class SessionsModule {}
