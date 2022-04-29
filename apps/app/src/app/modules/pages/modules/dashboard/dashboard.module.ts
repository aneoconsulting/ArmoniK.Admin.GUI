import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import * as Components from './components';
import { UiModule } from '@armonik.admin.gui/ui';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardComponent, Components.TasksSumUpComponent],
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
  ],
})
export class DashboardModule {}
