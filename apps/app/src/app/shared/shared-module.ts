import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AlertErrorComponent } from './components';
import { DateFilterComponent } from './filters';

@NgModule({
  imports: [
    ClarityModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
  declarations: [AlertErrorComponent, DateFilterComponent],
  exports: [
    AlertErrorComponent,
    DateFilterComponent,
    ClarityModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
})
export class SharedModule {}
