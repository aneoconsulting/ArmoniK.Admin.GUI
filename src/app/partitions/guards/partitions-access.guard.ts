import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '@services/user.service';

@Injectable({
  providedIn: 'root'
})
export class PartitionsAccessGuard implements CanActivate {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  canActivate(): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    const hasGetPermission = permissions.includes('Partitions:GetPartition');
    const hasListPermission = permissions.includes('Partitions:ListPartitions');
    
    if (!hasGetPermission && !hasListPermission) {
      // Redirect to dashboard if no permission
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    return true;
  }
}