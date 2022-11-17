import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { AutoRefreshDropdownComponent } from '../components';
import { SessionsListRoutingModule } from './sessions-list-routing.module';
import { SessionsListComponent } from './sessions-list.component';

/**
 * Sessions list module
 */
@NgModule({
  declarations: [SessionsListComponent, AutoRefreshDropdownComponent],
  imports: [SharedModule, SessionsListRoutingModule],
})
export class SessionsListModule {}
