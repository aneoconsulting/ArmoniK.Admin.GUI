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
import { AutoRefreshDropdownComponent } from '@armonik.admin.gui/shared/feature';
import { GrpcTasksService } from '@armonik.admin.gui/tasks/data-access';
import {
  ClrDatagridModule,
  ClrDropdownModule,
  ClrLoadingModule,
  ClrModalModule,
} from '@clr/angular';

import { ActionBarComponent } from '../../../shared/feature';
import {
  DateFilterComponent,
  IdFilterComponent,
  ComboBoxFilterComponent,
} from '../../../shared/feature/filters';
import { TasksListRoutingModule } from './tasks-list-routing.module';
import { TasksListComponent } from './tasks-list.page';
import { GrpcParamsService } from '@armonik.admin.gui/shared/data-access';

/**
 * Tasks list module
 */
@NgModule({
  declarations: [TasksListComponent],
  imports: [
    AutoRefreshDropdownComponent,
    RouterModule,
    ClrDatagridModule,
    ClrLoadingModule,
    ClrDropdownModule,
    ClrModalModule,
    TasksListRoutingModule,
    IdFilterComponent,
    DateFilterComponent,
    ComboBoxFilterComponent,
    ActionBarComponent,
    NgClass,
    AsyncPipe,
    DatePipe,
    JsonPipe,
    NgFor,
    NgIf,
  ],
  providers: [GrpcTasksService, GrpcParamsService],
})
export class TasksListModule {}
