import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@armonik.admin.gui/ui';
import { ClarityModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AlertErrorComponent } from './components';

@NgModule({
  imports: [
    ClarityModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
  declarations: [AlertErrorComponent],
  exports: [
    AlertErrorComponent,
    ClarityModule,
    CommonModule,
    HttpClientModule,
    RouterModule,
    TranslateModule,
    UiModule,
  ],
})
export class SharedModule {}
