import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationsService, TitleService } from '../../../core/';
import { DashboardComponent } from './dashboard.component';
import { ApplicationCardComponent } from './components';
import { ClarityModule } from '@clr/angular';

/**
 * Used to aggregate all the dashboard resources
 */
@NgModule({
  declarations: [DashboardComponent, ApplicationCardComponent],
  imports: [
    TranslateModule,
    CommonModule,
    UiModule,
    ClarityModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
    FlexLayoutModule,
  ],
  providers: [TitleService, ApplicationsService],
})
export class DashboardModule {}
