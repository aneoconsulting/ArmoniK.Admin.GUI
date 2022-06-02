import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { ApplicationCardComponent } from './components';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

/**
 * Dashboard page
 */
@NgModule({
  declarations: [DashboardComponent, ApplicationCardComponent],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
