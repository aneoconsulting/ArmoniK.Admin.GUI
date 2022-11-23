import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { SessionsListRoutingModule } from './sessions-list-routing.module';
import { SessionsListComponent } from './sessions-list.component';

/**
 * Sessions list module
 */
@NgModule({
  declarations: [SessionsListComponent],
  imports: [SharedModule, SessionsListRoutingModule],
})
export class SessionsListModule {}
