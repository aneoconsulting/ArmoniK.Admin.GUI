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
import { TranslateModule } from '@ngx-translate/core';
import { SessionsListRoutingModule } from './sessions-list-routing.module';
import { SessionsListComponent } from './sessions-list.page';
import { LanguageService } from '../../../shared/util';
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
    TranslateModule,
    NgClass,
    NgFor,
    NgIf,
    AsyncPipe,
    DatePipe,
    JsonPipe,
  ],
  providers: [LanguageService, GrpcSessionsService, GrpcPagerService],
})
export class SessionsListModule {}
