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
import { GrpcPagerService } from '@armonik.admin.gui/shared/data-access';
import { GrpcTasksService } from '@armonik.admin.gui/tasks/data-access';
import {
  ClrDatagridModule,
  ClrDropdownModule,
  ClrLoadingModule,
  ClrModalModule,
} from '@clr/angular';

import { ActionBarComponent } from '../../../shared/feature';
import {
  SelectFilterComponent,
  DateFilterComponent,
  IdFilterComponent,
} from '../../../shared/feature/filters';
import { TasksListRoutingModule } from './tasks-list-routing.module';
import { TasksListComponent } from './tasks-list.page';

/**
 * Tasks list module
 */
@NgModule({
  declarations: [TasksListComponent],
  imports: [
    RouterModule,
    ClrDatagridModule,
    ClrLoadingModule,
    ClrDropdownModule,
    ClrModalModule,
    TasksListRoutingModule,
    SelectFilterComponent,
    IdFilterComponent,
    DateFilterComponent,
    ActionBarComponent,
    NgClass,
    AsyncPipe,
    DatePipe,
    JsonPipe,
    NgFor,
    NgIf,
  ],
  providers: [GrpcTasksService, GrpcPagerService],
})
export class TasksListModule {}
