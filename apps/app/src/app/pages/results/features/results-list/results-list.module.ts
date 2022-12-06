import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GrpcResultsService } from '@armonik.admin.gui/results/data-access';
import { AutoRefreshDropdownComponent } from '@armonik.admin.gui/shared/feature';
import { GrpcPagerService } from '@armonik.admin.gui/shared/util';
import {
  ClrDatagridModule,
  ClrDropdownModule,
  ClrIconModule,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ResultsListRoutingModule } from './results-list-routing.module';
import { ResultsListComponent } from './results-list.page';

@NgModule({
  declarations: [ResultsListComponent],
  imports: [
    AutoRefreshDropdownComponent,
    RouterModule,
    ClrIconModule,
    ClrDropdownModule,
    ClrDatagridModule,
    TranslateModule,
    ResultsListRoutingModule,
    NgClass,
    AsyncPipe,
    DatePipe,
    NgFor,
    NgIf,
  ],
  providers: [GrpcResultsService, GrpcPagerService],
})
export class ResultsListModule {}
