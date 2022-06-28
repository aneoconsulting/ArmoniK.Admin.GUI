import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import {
  ApplicationCardComponent,
  ApplicationsErrorsListComponent,
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
    ApplicationsErrorsListComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
