import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'partitions',
    loadChildren: () => import('./partitions/routes').then(mod => mod.PARTITIONS_ROUTES)
  }
];
