import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertErrorComponent } from './alert-error.component';

@NgModule({
  declarations: [AlertErrorComponent],
  imports: [CommonModule, ClarityModule],
  providers: [TranslateService],
  exports: [AlertErrorComponent],
})
export class AlertErrorModule {}
