import {
  AsyncPipe,
  DatePipe,
  JsonPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GrpcSessionsService } from '@armonik.admin.gui/sessions/data-access';
import { AutoRefreshDropdownComponent } from '@armonik.admin.gui/shared/feature';
import { GrpcPagerService } from '@armonik.admin.gui/shared/data-access';
import {
  ClrDatagridModule,
  ClrIconModule,
  ClrLoadingModule,
  ClrModalModule,
} from '@clr/angular';

import { SessionsListRoutingModule } from './sessions-list-routing.module';
import { SessionsListComponent } from './sessions-list.page';
import {
  DateFilterComponent,
  IdFilterComponent,
  SelectFilterComponent,
} from '../../../shared/feature/filters';
import { ActionBarComponent } from '../../../shared/feature';

/**
 * Sessions list module
 */
@NgModule({
  declarations: [SessionsListComponent],
  imports: [
    AutoRefreshDropdownComponent,
    RouterModule,
    SessionsListRoutingModule,
    ClrDatagridModule,
    ClrModalModule,
    ClrLoadingModule,
    ClrIconModule,
    ActionBarComponent,
    NgClass,
    NgFor,
    NgIf,
    AsyncPipe,
    DatePipe,
    JsonPipe,
    IdFilterComponent,
    DateFilterComponent,
    SelectFilterComponent,
  ],
  providers: [GrpcSessionsService, GrpcPagerService],
})
export class SessionsListModule {}
