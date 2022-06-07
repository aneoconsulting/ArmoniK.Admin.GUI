import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './sessions.component';

import '@clr/icons';
import '@clr/icons/shapes/essential-shapes';

/**
 * Sessions page
 */
@NgModule({
  declarations: [SessionsComponent],
  imports: [SharedModule, SessionsRoutingModule],
})
export class SessionsModule {}
