import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './sessions.component';

/**
 * Sessions page
 */
@NgModule({
  declarations: [SessionsComponent],
  imports: [SharedModule, SessionsRoutingModule],
})
export class SessionsModule {}
