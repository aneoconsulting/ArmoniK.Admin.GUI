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
import { BrowserTitleService, LanguageService } from '../../../util';
import {
  DateFilterComponent,
  IdFilterComponent,
  SessionsStatusFilterComponent,
} from '../../../../shared/filters';

/**
 * Sessions list module
 */
@NgModule({
  declarations: [SessionsListComponent],
  providers: [
    BrowserTitleService,
    LanguageService,
    GrpcSessionsService,
    GrpcPagerService,
  ],
  imports: [
    AutoRefreshDropdownComponent,
    RouterModule,
    SessionsListRoutingModule,
    ClrDatagridModule,
    ClrModalModule,
    ClrLoadingModule,
    ClrIconModule,
    TranslateModule,
    NgClass,
    NgFor,
    NgIf,
    AsyncPipe,
    DatePipe,
    JsonPipe,
    IdFilterComponent,
    DateFilterComponent,
    SessionsStatusFilterComponent,
  ],
})
export class SessionsListModule {}
