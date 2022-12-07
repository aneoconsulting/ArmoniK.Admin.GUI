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
import {
  AutoRefreshDropdownComponent,
  DatagridComponent,
} from '@armonik.admin.gui/shared/feature';
import { GrpcPagerService } from '@armonik.admin.gui/shared/util';
import {
  ClrDatagridModule,
  ClrIconModule,
  ClrLoadingModule,
  ClrModalModule,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserTitleService, LanguageService } from '../../../../core';
import { SessionsListRoutingModule } from './sessions-list-routing.module';
import { SessionsListComponent } from './sessions-list.page';

/**
 * Sessions list module
 */
@NgModule({
  declarations: [SessionsListComponent],
  imports: [
    AutoRefreshDropdownComponent,
    DatagridComponent,
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
  ],
  providers: [
    BrowserTitleService,
    LanguageService,
    GrpcSessionsService,
    GrpcPagerService,
  ],
})
export class SessionsListModule {}
