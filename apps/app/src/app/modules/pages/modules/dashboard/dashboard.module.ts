import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { TranslateModule } from '@ngx-translate/core';
import { TitleService } from '../../../core/services';
import { DashboardComponent } from './dashboard.component';
import { ApplicationCardComponent } from './components';

@NgModule({
  declarations: [DashboardComponent, ApplicationCardComponent],
  imports: [
    TranslateModule,
    CommonModule,
    UiModule,
    RouterModule.forChild([{ path: '', component: DashboardComponent }]),
    FlexLayoutModule,
  ],
  providers: [TitleService],
})
export class DashboardModule {}
