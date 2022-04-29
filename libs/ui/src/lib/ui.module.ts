import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from './header/header.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { CardModule } from './card/card.module';

@NgModule({
  imports: [CommonModule, HeaderModule, SidenavModule, CardModule],
  declarations: [],
  exports: [HeaderModule, SidenavModule, CardModule],
})
export class UiModule {}
