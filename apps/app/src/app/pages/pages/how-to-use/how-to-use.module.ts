import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { HowToUseRoutingModule } from './how-to-use-routing.module';
import { HowToUseComponent } from './how-to-use.component';

/**
 * How to use page
 */
@NgModule({
  declarations: [HowToUseComponent],
  imports: [SharedModule, HowToUseRoutingModule],
})
export class HowToUseModule {}
