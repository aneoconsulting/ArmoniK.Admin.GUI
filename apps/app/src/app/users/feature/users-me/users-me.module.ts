import { NgModule } from '@angular/core';
import { UsersMeComponent } from './users-me.page';
import { UsersMeRoutingModule } from './users-me-routing.module';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@NgModule({
  declarations: [UsersMeComponent],
  imports: [UsersMeRoutingModule, NgIf, NgFor, AsyncPipe],
})
export class UsersMeModule {}
