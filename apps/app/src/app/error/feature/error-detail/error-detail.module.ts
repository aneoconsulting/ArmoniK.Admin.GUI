import { NgModule } from '@angular/core';

import { ErrorDetailRoutingModule } from './error-detail-routing.module';
import { ErrorDetailComponent } from './error-detail.page';

/**
 * Tasks list module
 */
@NgModule({
  declarations: [ErrorDetailComponent],
  imports: [ErrorDetailRoutingModule],
})
export class ErrorDetailModule {}
