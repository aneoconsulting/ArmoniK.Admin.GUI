import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationsComponent } from './applications.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ApplicationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: ApplicationsComponent }]),
  ],
})
export class ApplicationsModule {}
