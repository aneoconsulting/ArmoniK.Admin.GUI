import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationCardComponent } from './components';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.page';

/**
 * Dashboard page
 */
@NgModule({
  declarations: [DashboardComponent, ApplicationCardComponent],
  imports: [TranslateModule, DashboardRoutingModule],
})
export class DashboardModule {}
