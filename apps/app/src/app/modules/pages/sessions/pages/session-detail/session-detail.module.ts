import { NgModule } from '@angular/core';
import { SharedModule } from 'apps/app/src/app/shared';
import { TasksListComponent } from './components';
import { TaskDetailComponent } from './pages';
import { SessionDetailRoutingModule } from './session-detail-routing.module';
import { SessionDetailComponent } from './session-detail.component';

@NgModule({
  declarations: [
    SessionDetailComponent,
    TasksListComponent,
    TaskDetailComponent,
  ],
  imports: [SharedModule, SessionDetailRoutingModule],
})
export class SessionDetailModule {}
