import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { GrpcApplicationsService } from '@armonik.admin.gui/applications/data-access';
import { GrpcPagerService } from '@armonik.admin.gui/shared/data-access';
import {
  AutoRefreshDropdownComponent,
  AutoRefreshService,
} from '@armonik.admin.gui/shared/feature';
import {
  ClrDatagridModule,
  ClrDropdownModule,
  ClrIconModule,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ActionBarComponent } from '../../../shared/feature';
import { ApplicationsListComponent } from './applications-list.page';
import { ApplicationsListRoutingModule } from './applications-list-routing.module';

@NgModule({
  declarations: [ApplicationsListComponent],
  imports: [
    AutoRefreshDropdownComponent,
    ClrIconModule,
    ClrDropdownModule,
    ClrDatagridModule,
    TranslateModule,
    ApplicationsListRoutingModule,
    ActionBarComponent,
    NgClass,
    AsyncPipe,
    DatePipe,
    NgFor,
    NgIf,
  ],
  providers: [GrpcApplicationsService, GrpcPagerService, AutoRefreshService],
})
export class ApplicationsListModule {}
