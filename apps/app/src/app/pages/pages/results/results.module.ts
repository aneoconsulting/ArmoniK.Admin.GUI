import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { ResultsListComponent } from './components';
import { ResultsRoutingModule } from './results-routing.module';
import { ResultsComponent } from './results.component';

/**
 * Results module
 */
@NgModule({
  declarations: [ResultsComponent, ResultsListComponent],
  imports: [ResultsRoutingModule, SharedModule],
})
export class ResultsModule {}
