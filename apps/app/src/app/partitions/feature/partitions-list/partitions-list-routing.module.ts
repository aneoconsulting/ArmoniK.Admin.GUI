import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartitionsListComponent } from './partitions-list.page';

const routes: Routes = [
  {
    path: '',
    title: $localize`Partitions List`,
    component: PartitionsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartitionsListRoutingModule {}
