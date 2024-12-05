import { Routes } from '@angular/router';
import { UserConnectedGuard } from './guards/user-connected-guard.component';
import { IndexComponent } from './index.component';

export const PROFILE_ROUTES: Routes = [
  { path: '', component: IndexComponent, canActivate: [UserConnectedGuard] },
];
