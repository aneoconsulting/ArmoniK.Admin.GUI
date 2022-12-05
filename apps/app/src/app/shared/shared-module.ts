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
  ModalFavoritesComponent,
  AutoRefreshDropdownComponent,
} from './components';
import { SinceDateFilterComponent, TaskStatusFilterComponent } from './filters';
import { StatesService } from './services';
import { ResultsStatusFilterComponent } from './filters/results-status-filter/results-status-filter.component';

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
    ModalFavoritesComponent,
    AutoRefreshDropdownComponent,
    ResultsStatusFilterComponent,
  ],
  exports: [
    AlertErrorComponent,
    TimerIntervalSelectorComponent,
    AutoRefreshActivatorComponent,
    TaskStatusFilterComponent,
    SinceDateFilterComponent,
    ResultsStatusFilterComponent,
    ModalFavoritesComponent,
    AutoRefreshDropdownComponent,
    ClarityModule,
    FormsModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
})
export class SharedModule {}
