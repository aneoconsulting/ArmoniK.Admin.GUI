import { AsyncPipe, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GrpcPartitionsService } from '@armonik.admin.gui/partitions/data-access';
import { GrpcPagerService } from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridModule } from '@clr/angular';
import { ActionBarComponent } from '../../../shared/feature';
import { IdFilterComponent } from '../../../shared/feature/filters';
import { PartitionsListRoutingModule } from './partitions-list-routing.module';
import { PartitionsListComponent } from './partitions-list.page';

@NgModule({
  declarations: [PartitionsListComponent],
  imports: [
    CommonModule,
    ActionBarComponent,
    ClrDatagridModule,
    AsyncPipe,
    PartitionsListRoutingModule,
    IdFilterComponent,
  ],
  providers: [GrpcPartitionsService ,GrpcPagerService],
})
export class PartitionsListModule {}
