import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared';
import { ApplicationsListRoutingModule } from './applications-list-routing.module';
import { ApplicationsListComponent } from './applications-list.component';

@NgModule({
  declarations: [ApplicationsListComponent],
  imports: [SharedModule, ApplicationsListRoutingModule],
})
export class ApplicationsListModule {}
