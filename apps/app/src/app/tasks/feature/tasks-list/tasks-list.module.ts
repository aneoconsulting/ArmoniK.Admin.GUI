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
import { AutoRefreshDropdownComponent } from '@armonik.admin.gui/shared/feature';
import { GrpcTasksService } from '@armonik.admin.gui/tasks/data-access';
import {
  ClrDatagridModule,
  ClrDropdownModule,
  ClrLoadingModule,
  ClrModalModule,
} from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TaskStatusFilterComponent } from '../../../shared/feature/filters';
import { TasksListRoutingModule } from './tasks-list-routing.module';
import { TasksListComponent } from './tasks-list.page';

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
    TranslateModule,
    TasksListRoutingModule,
    TaskStatusFilterComponent,
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
