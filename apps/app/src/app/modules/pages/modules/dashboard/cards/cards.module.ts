import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from './card/card.module';
import { CardsComponent } from './cards.component';

@NgModule({
  declarations: [CardsComponent],
  imports: [CommonModule, CardModule],
  exports: [CardsComponent],
})
export class CardsModule {}
