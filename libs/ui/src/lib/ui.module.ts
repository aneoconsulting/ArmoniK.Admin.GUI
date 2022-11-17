import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header';
import { PageHeaderComponent } from './page-header';

@NgModule({
  imports: [CommonModule, HeaderComponent, PageHeaderComponent],
  declarations: [],
  exports: [HeaderComponent, PageHeaderComponent],
})
export class UiModule {}
