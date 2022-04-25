import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from './header/header.module';
import { SidenavModule } from './sidenav/sidenav.module';

@NgModule({
  imports: [CommonModule, HeaderModule, SidenavModule],
  declarations: [],
  exports: [HeaderModule, SidenavModule],
})
export class UiModule {}
