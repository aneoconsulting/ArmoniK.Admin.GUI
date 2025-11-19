import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '@services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsAccessGuard implements CanActivate {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  canActivate(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    const hasPermission = permissions.includes('Applications:ListApplications');
    
    if (!hasPermission) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    return true;
  }
}