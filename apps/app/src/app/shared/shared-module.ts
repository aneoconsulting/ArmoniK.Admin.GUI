import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertErrorComponent,
  TimerIntervalSelectorComponent,
  AutoRefreshActivatorComponent,
} from './components';
import { SinceDateFilterComponent, TaskStatusFilterComponent } from './filters';
import { StatesService } from './services';

@NgModule({
  imports: [
    TaskStatusFilterComponent,
    SinceDateFilterComponent,
    AlertErrorComponent,
    TimerIntervalSelectorComponent,
    AutoRefreshActivatorComponent,
  ],
  providers: [StatesService],
  declarations: [],
  exports: [
    AlertErrorComponent,
    TimerIntervalSelectorComponent,
    AutoRefreshActivatorComponent,
    TaskStatusFilterComponent,
    SinceDateFilterComponent,
  ],
})
export class SharedModule {}
