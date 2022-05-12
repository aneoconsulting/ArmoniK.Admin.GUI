import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsComponent } from './sessions.component';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import * as Components from './components';
import { TranslateModule } from '@ngx-translate/core';
import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';

@NgModule({
  declarations: [
    SessionsComponent,
    Components.SessionActionComponent,
    Components.SessionErrorsComponent,
  ],
  imports: [
    CommonModule,
    ClarityModule,
    TranslateModule,
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
