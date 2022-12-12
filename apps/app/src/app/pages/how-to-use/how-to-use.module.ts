import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClrIconModule } from '@clr/angular';
import { HowToUseRoutingModule } from './how-to-use-routing.module';
import { HowToUseComponent } from './how-to-use.page';

/**
 * How to use page
 */
@NgModule({
  declarations: [HowToUseComponent],
  imports: [ClrIconModule, HowToUseRoutingModule, NgIf],
})
export class HowToUseModule {}
