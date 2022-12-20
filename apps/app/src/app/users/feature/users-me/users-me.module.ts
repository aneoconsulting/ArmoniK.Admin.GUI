import { NgModule } from '@angular/core';
import { UsersMeComponent } from './users-me.page';
import { UsersMeRoutingModule } from './users-me-routing.module';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UsersMeComponent],
  imports: [UsersMeRoutingModule, TranslateModule, NgIf, NgFor, AsyncPipe],
})
export class UsersMeModule {}
