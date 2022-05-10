import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionsComponent } from './sessions.component';
import { TitleService } from '../../../core/title.service';

@NgModule({
  declarations: [SessionsComponent],
  imports: [CommonModule],
  providers: [TitleService],
})
export class SessionsModule {}
