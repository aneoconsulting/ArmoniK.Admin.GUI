import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import * as Components from './components';
import { UiModule } from '@armonik.admin.gui/ui';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DashboardComponent, Components.TasksSumUpComponent],
  imports: [
    TranslateModule,
    CommonModule,
    UiModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
  ],
})
export class DashboardModule {}
