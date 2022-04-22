import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidenavComponent } from './sidenav/sidenav.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HeaderComponent, SidenavComponent],
  exports: [HeaderComponent, SidenavComponent],
})
export class UiModule {}
