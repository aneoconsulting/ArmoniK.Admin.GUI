import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserConnectedGuard {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  canActivate() {
    if (this.userService.user !== undefined) {
      return true;
    }
    this.router.navigateByUrl('/dashboard');
    return false;
  }
}