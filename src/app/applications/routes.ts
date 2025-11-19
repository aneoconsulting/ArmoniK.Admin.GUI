import { Route } from '@angular/router';
import { ApplicationsAccessGuard } from './guards/applications-access.guard';
import { IndexComponent } from './index.component';

export const APPLICATIONS_ROUTES: Route[] = [
  { 
    path: '', 
    component: IndexComponent,
    canActivate: [ApplicationsAccessGuard]
  },
];