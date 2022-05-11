import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from './header/header.module';
import { CardModule } from './card/card.module';

@NgModule({
  imports: [CommonModule, HeaderModule, CardModule],
  declarations: [],
  exports: [HeaderModule, CardModule],
})
export class UiModule {}
