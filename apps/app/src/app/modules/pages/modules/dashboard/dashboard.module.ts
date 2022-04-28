import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { CardsModule } from './cards/cards.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, CardsModule],
})
export class DashboardModule {}
