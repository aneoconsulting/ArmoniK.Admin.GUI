import { Route } from '@angular/router';
import { SessionGraphComponent } from './graph.component';
import { IndexComponent } from './index.component';
import { ShowComponent } from './show.component';

export const SESSIONS_ROUTES: Route[] = [
  { path: '', component: IndexComponent },
  { path: ':id', component: ShowComponent },
  { path: 'graph/:id', component: SessionGraphComponent },
];
