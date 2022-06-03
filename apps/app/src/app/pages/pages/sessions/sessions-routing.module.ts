import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionsSessionResolver } from './services';
import { SessionsComponent } from './sessions.component';

const routes: Routes = [
  {
    path: ':application/sessions',
    component: SessionsComponent,
  },
  {
    path: ':application/sessions/:session',
    loadChildren: () =>
      import('./pages/session-detail/session-detail.module').then(
        (m) => m.SessionDetailModule
      ),
    resolve: {
      session: SessionsSessionResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [SessionsSessionResolver],
  exports: [RouterModule],
})
export class SessionsRoutingModule {}
