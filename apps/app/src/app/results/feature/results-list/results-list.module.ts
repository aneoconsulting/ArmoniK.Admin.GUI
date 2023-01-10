import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { GrpcResultsService } from '@armonik.admin.gui/results/data-access';
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

import { ResultsListRoutingModule } from './results-list-routing.module';
import { ResultsListComponent } from './results-list.page';
import {
  SelectFilterComponent,
  DateFilterComponent,
  IdFilterComponent,
} from '../../../shared/feature/filters';
import { ActionBarComponent } from '../../../shared/feature';

@NgModule({
  declarations: [ResultsListComponent],
  imports: [
    AutoRefreshDropdownComponent,
    ClrIconModule,
    ClrDropdownModule,
    ClrDatagridModule,
    SelectFilterComponent,
    DateFilterComponent,
    IdFilterComponent,
    ActionBarComponent,
    ResultsListRoutingModule,
    NgClass,
    AsyncPipe,
    DatePipe,
    NgFor,
    NgIf,
  ],
  providers: [GrpcResultsService, GrpcPagerService, AutoRefreshService],
})
export class ResultsListModule {}
