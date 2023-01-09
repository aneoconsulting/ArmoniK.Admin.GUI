import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.page';
import { AsyncPipe } from '@angular/common';

/**
 * Error module
 */
@NgModule({
  declarations: [ErrorComponent],
  imports: [TranslateModule, ErrorRoutingModule, AsyncPipe],
})
export class ErrorModule {}
