import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorDetailComponent } from './error-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ErrorDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorDetailRoutingModule {}
