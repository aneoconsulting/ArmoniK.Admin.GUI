import { NgModule } from '@angular/core';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.page';
import { AsyncPipe } from '@angular/common';

/**
 * Error module
 */
@NgModule({
  declarations: [ErrorComponent],
  imports: [ErrorRoutingModule, AsyncPipe],
})
export class ErrorModule {}
