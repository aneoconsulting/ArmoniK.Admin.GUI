import { Route } from '@angular/router';
import { PartitionsAccessGuard } from './guards/partitions-access.guard';
import { IndexComponent } from './index.component';
import { ShowComponent } from './show.component';

export const PARTITIONS_ROUTES: Route[] = [
  { 
    path: '', 
    component: IndexComponent,
    canActivate: [PartitionsAccessGuard]
  },
  { 
    path: ':id', 
    component: ShowComponent,
    canActivate: [PartitionsAccessGuard]
  },
];
