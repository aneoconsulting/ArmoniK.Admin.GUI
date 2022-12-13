import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HowToUseComponent } from './how-to-use.page';

const routes: Routes = [
  {
    path: '',
    component: HowToUseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HowToUseRoutingModule {}
