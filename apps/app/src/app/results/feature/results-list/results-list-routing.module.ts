import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsListComponent } from './results-list.page';

const routes: Routes = [
  {
    path: '',
    title: $localize`Results List`,
    component: ResultsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResultsListRoutingModule {}
