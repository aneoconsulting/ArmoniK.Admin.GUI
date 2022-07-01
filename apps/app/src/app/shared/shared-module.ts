import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AlertErrorComponent } from './components';
import { AutoRefreshActivatorComponent } from './components/auto-refresh-activator';
import { TimerIntervalSelectorComponent } from './components/timer-interval-selector';

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
  ],
  exports: [
    AlertErrorComponent,
    TimerIntervalSelectorComponent,
    AutoRefreshActivatorComponent,
    ClarityModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
})
export class SharedModule {}
