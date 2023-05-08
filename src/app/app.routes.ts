import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'applications',
    loadChildren: () => import('./applications/routes').then(mod => mod.APPLICATIONS_ROUTES)
  }
];
