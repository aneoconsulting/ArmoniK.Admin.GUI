import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { GrpcApplicationsService } from '@armonik.admin.gui/applications/data-access';
import {
  ClrDatagridModule,
  ClrDropdownModule,
  ClrIconModule,
} from '@clr/angular';
import { ApplicationsListRoutingModule } from './applications-list-routing.module';
import { ActionBarComponent } from '../../../shared/feature';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import { ApplicationsListComponent } from './applications-list.page';
import { IdFilterComponent } from '../../../shared/feature/filters';

@NgModule({
  declarations: [ApplicationsListComponent],
  imports: [
    ClrIconModule,
    ClrDropdownModule,
    ClrDatagridModule,
    ActionBarComponent,
    ApplicationsListRoutingModule,
    ActionBarComponent,
    NgClass,
    AsyncPipe,
    DatePipe,
    NgFor,
    NgIf,
    IdFilterComponent,
  ],
  providers: [GrpcApplicationsService, GrpcParamsService],
})
export class ApplicationsListModule {}
