import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import {
  ApplicationCardComponent,
  TasksErrorsListComponent,
} from './components';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

/**
 * Dashboard page
 */
@NgModule({
  declarations: [
    DashboardComponent,
    ApplicationCardComponent,
    TasksErrorsListComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
