import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { GrpcResultsService } from '@armonik.admin.gui/results/data-access';
import { GrpcPagerService } from '@armonik.admin.gui/shared/data-access';
import { AutoRefreshDropdownComponent } from '@armonik.admin.gui/shared/feature';
import {
  ClrDatagridModule,
  ClrDropdownModule,
  ClrIconModule,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ResultsListRoutingModule } from './results-list-routing.module';
import { ResultsListComponent } from './results-list.page';
import {
  SelectFilterComponent,
  DateFilterComponent,
  IdFilterComponent,
  ClearFiltersComponent,
} from '../../../shared/feature/filters';
import { ClearOrderComponent } from '../../../shared/feature';

@NgModule({
  declarations: [ResultsListComponent],
  imports: [
    AutoRefreshDropdownComponent,
    ClrIconModule,
    ClrDropdownModule,
    ClrDatagridModule,
    TranslateModule,
    SelectFilterComponent,
    DateFilterComponent,
    IdFilterComponent,
    ClearFiltersComponent,
    ResultsListRoutingModule,
    ClearOrderComponent,
    NgClass,
    AsyncPipe,
    DatePipe,
    NgFor,
    NgIf,
  ],
  providers: [GrpcResultsService, GrpcPagerService],
})
export class ResultsListModule {}
