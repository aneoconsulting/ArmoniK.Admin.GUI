import { NgModule } from '@angular/core';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { GrpcApplicationsService } from '@armonik.admin.gui/applications/data-access';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import { AsyncPipe } from '@angular/common';
import { DashboardComponent } from './dashboard.page';
import { GrpcTasksService } from '@armonik.admin.gui/tasks/data-access';
import {
  ApplicationCardComponent,
  EveryTasksByStatusComponent,
} from '../../../shared/feature';
import { ClrButtonGroupModule } from '@clr/angular';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    EveryTasksByStatusComponent,
    ApplicationCardComponent,
    DashboardRoutingModule,
    ClrButtonGroupModule,
    NgIf,
    NgFor,
    AsyncPipe,
    JsonPipe,
  ],
  providers: [GrpcParamsService, GrpcApplicationsService, GrpcTasksService],
})
export class DashboardModule {}
