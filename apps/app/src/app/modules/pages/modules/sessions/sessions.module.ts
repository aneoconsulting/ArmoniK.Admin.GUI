import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsComponent } from './sessions.component';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import * as Components from './components';

@NgModule({
  declarations: [SessionsComponent],
  imports: [
    CommonModule,
    ClarityModule,
    RouterModule.forChild([
      {
        path: '',
        component: SessionsComponent,
      },
      {
        path: ':id',
        component: Components.SessionDetailComponent,
      },
    ]),
  ],
})
export class SessionsModule {}
