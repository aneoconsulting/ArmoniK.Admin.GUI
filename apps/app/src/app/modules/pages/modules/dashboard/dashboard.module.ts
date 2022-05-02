import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { TitleService } from '../../../core/title.service';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule],
  providers: [TitleService],
})
export class DashboardModule {}
