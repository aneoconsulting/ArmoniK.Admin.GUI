import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderModule } from './header/header.module';
import { PageHeaderModule } from './page-header';

@NgModule({
  imports: [CommonModule, HeaderModule, PageHeaderModule],
  declarations: [],
  exports: [HeaderModule, PageHeaderModule],
})
export class UiModule {}
