import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav.component';
import { ClarityModule } from '@clr/angular';
@NgModule({
  declarations: [SidenavComponent],
  imports: [CommonModule, ClarityModule],
  exports: [SidenavComponent],
})
export class SidenavModule {}
