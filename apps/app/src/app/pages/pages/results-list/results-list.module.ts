import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { ResultsListRoutingModule } from './results-list-routing.module';
import { ResultsListComponent } from './results-list.component';

@NgModule({
  declarations: [ResultsListComponent],
  imports: [SharedModule, ResultsListRoutingModule],
})
export class ResultsListModule {}
