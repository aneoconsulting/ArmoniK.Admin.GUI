import { AsyncPipe, JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { GrpcApplicationsService } from '@armonik.admin.gui/applications/data-access';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';
import { GrpcTasksService } from '@armonik.admin.gui/tasks/data-access';
import { ClrButtonGroupModule } from '@clr/angular';
import {
  ApplicationCardComponent,
  EveryTasksByStatusComponent,
} from '../../../shared/feature';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.page';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    EveryTasksByStatusComponent,
    ApplicationCardComponent,
    DashboardRoutingModule,
    ClrButtonGroupModule,
    NgIf,
    NgForOf,
    AsyncPipe,
    JsonPipe,
  ],
  providers: [GrpcParamsService, GrpcApplicationsService, GrpcTasksService],
})
export class DashboardModule { }
