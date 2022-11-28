import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertErrorComponent,
  TimerIntervalSelectorComponent,
  AutoRefreshActivatorComponent,
} from './components';
import { SinceDateFilterComponent, TaskStatusFilterComponent } from './filters';
import { StatesService } from './services';
import { SessionListFilterComponent } from './filters/sessions-list-filter/sessions-list-filter.component';
import { SessionsStatusFilterComponent } from './filters/sessions-status-filter/sessions-status-filter.component';
import { IdFilterComponent } from './filters/id-filter/id-filter.component';

@NgModule({
  imports: [
    FormsModule,
    ClarityModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
  providers: [StatesService],
  declarations: [
    AlertErrorComponent,
    TimerIntervalSelectorComponent,
    AutoRefreshActivatorComponent,
    TaskStatusFilterComponent,
    SinceDateFilterComponent,
    SessionListFilterComponent,
    SessionsStatusFilterComponent,
    IdFilterComponent,
  ],
  exports: [
    AlertErrorComponent,
    TimerIntervalSelectorComponent,
    AutoRefreshActivatorComponent,
    TaskStatusFilterComponent,
    SinceDateFilterComponent,
    SessionListFilterComponent,
    SessionsStatusFilterComponent,
    IdFilterComponent,
    ClarityModule,
    FormsModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
})
export class SharedModule {}
