import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorDetailRoutingModule } from './error-detail-routing.module';
import { ErrorDetailComponent } from './error-detail.page';

/**
 * Tasks list module
 */
@NgModule({
  declarations: [ErrorDetailComponent],
  imports: [TranslateModule, ErrorDetailRoutingModule],
})
export class ErrorDetailModule {}
