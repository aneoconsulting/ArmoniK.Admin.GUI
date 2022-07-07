import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertErrorComponent,
  TimerIntervalSelectorComponent,
  AutoRefreshActivatorComponent,
} from './components';
import { TaskStatusFilterComponent } from './filters';

@NgModule({
  imports: [
    ClarityModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
  declarations: [
    AlertErrorComponent,
    TimerIntervalSelectorComponent,
    AutoRefreshActivatorComponent,
    TaskStatusFilterComponent,
  ],
  exports: [
    AlertErrorComponent,
    TimerIntervalSelectorComponent,
    AutoRefreshActivatorComponent,
    TaskStatusFilterComponent,
    ClarityModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
})
export class SharedModule {}
