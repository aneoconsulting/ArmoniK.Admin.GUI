import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { TranslateModule } from '@ngx-translate/core';
import { TitleService } from '../../../core/services';
import * as Components from './components';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent, Components.TasksSumUpComponent],
  imports: [
    TranslateModule,
    CommonModule,
    UiModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
  ],
  providers: [TitleService],
})
export class DashboardModule {}
